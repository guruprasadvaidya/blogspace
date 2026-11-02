import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from "../index";
import appwriteService from "../../appwrite/configuration";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PostForm({ post }) {
  const navigate = useNavigate();

  // Get logged-in user from Redux
  const userData = useSelector((state) => state.auth.userData);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      status: post?.status || "active",
      slug: post?.slug || "",
    },
  });

  const title = watch("title");

  // Convert title into a URL-friendly slug
  const slugTransform = (value) => {
    if (!value || typeof value !== "string") return "";

    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  // Preserve the existing slug when editing a post.
  // Generate a new slug only when the title changes.
  const previousTitle = useRef(title);

  useEffect(() => {
    if (title !== previousTitle.current) {
      setValue("slug", slugTransform(title), {
        shouldValidate: true,
        shouldDirty: true,
      });

      previousTitle.current = title;
    }
  }, [title, setValue]);

  // Submit form
  const submit = async (data) => {
    let uploadedFileId = "";
    let databaseSaved = false;

    try {
      // Keep existing image if no new image is selected
      let fileId =
        post?.featuredimage || post?.featuredImage || "";

      const file = data.image?.[0];

      // Upload new image if selected
      if (file) {
        const uploadedFile = await appwriteService.uploadFile(file);

        if (!uploadedFile?.$id) {
          throw new Error("Featured image upload failed.");
        }

        fileId = uploadedFile.$id;
        uploadedFileId = uploadedFile.$id;
      }

      if (!fileId) {
        throw new Error("Please select a featured image.");
      }

      // Prepare post data
      const postData = {
        title: data.title.trim(),
        slug: slugTransform(data.slug),
        content: data.content,
        featuredImage: fileId,
        status: data.status,
      };

      let dbPost;

      // Update existing post
      if (post) {
        dbPost = await appwriteService.updatePost(
          post.$id,
          postData
        );
      } else {
        // Validate logged-in user before creating a post
        if (!userData?.$id) {
          throw new Error(
            "User information is missing. Please log in again."
          );
        }

        // Create new post
        dbPost = await appwriteService.createPost({
          ...postData,
          userId: userData.$id,
        });
      }

      if (!dbPost) {
        throw new Error(
          "Post could not be saved. Please check the Appwrite errors."
        );
      }

      databaseSaved = true;

      // Delete old image only after successful database update
      const previousImageId =
        post?.featuredimage || post?.featuredImage;

      if (
        post &&
        file &&
        previousImageId &&
        previousImageId !== fileId
      ) {
        try {
          await appwriteService.deleteFile(previousImageId);
        } catch (imageError) {
          console.warn(
            "Could not delete the previous featured image:",
            imageError
          );
        }
      }

      // Navigate to the saved post
      navigate(`/post/${dbPost.slug}`);
    } catch (error) {
      console.error("Post submission failed:", error);

      // Clean up newly uploaded image if database saving failed
      if (uploadedFileId && !databaseSaved) {
        try {
          await appwriteService.deleteFile(uploadedFileId);
        } catch (cleanupError) {
          console.warn(
            "Could not clean up the uploaded image:",
            cleanupError
          );
        }
      }

      alert(
        error?.message ||
          "Something went wrong while saving the post."
      );
    }
  };

  // Existing featured image
  const currentImage =
    post?.featuredimage || post?.featuredImage;

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="mx-auto w-full max-w-7xl"
    >
      {/* Page heading */}
      <div className="mb-8 border-b border-[#EAE7E2] pb-6">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#7956A8]">
          Blogspace Studio
        </p>

        <h1 className="mb-2 text-3xl font-bold tracking-tight text-[#211D25] sm:text-4xl">
          {post ? "Edit your story" : "Create a new story"}
        </h1>

        <p className="text-sm text-[#77717C] sm:text-base">
          {post
            ? "Make your changes and keep your readers updated."
            : "Put your thoughts into words and share them with your readers."}
        </p>
      </div>

      {/* Main workspace */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">

        {/* Writing area */}
        <section className="min-w-0 rounded-2xl border border-[#EAE7E2] bg-white p-4 sm:p-6 lg:p-8">

          {/* Title */}
          <div className="mb-6">
            <label
              htmlFor="post-title"
              className="mb-2 block text-sm font-semibold text-[#211D25]"
            >
              Story title
            </label>

            <Input
              id="post-title"
              placeholder="Give your story a meaningful title..."
              className="!rounded-xl !border-[#EAE7E2] !px-4 !py-3 !text-lg !font-medium placeholder:!font-normal focus:!border-[#7956A8] focus:!ring-2 focus:!ring-[#7956A8]/10"
              {...register("title", {
                required: "A title is required.",
                validate: (value) =>
                  value.trim().length > 0 ||
                  "Title cannot be empty.",
              })}
            />

            {errors.title && (
              <p className="mt-2 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Slug */}
          <div className="mb-6">
            <label
              htmlFor="post-slug"
              className="mb-2 block text-sm font-semibold text-[#211D25]"
            >
              URL slug
            </label>

            <Input
              id="post-slug"
              placeholder="your-story-url"
              className="!rounded-xl !border-[#EAE7E2] !px-4 !py-3 focus:!border-[#7956A8] focus:!ring-2 focus:!ring-[#7956A8]/10"
              {...register("slug", {
                required: "A URL slug is required.",
                validate: (value) =>
                  value.trim().length > 0 ||
                  "Slug cannot be empty.",
              })}
            />

            <p className="mt-2 text-xs text-[#77717C]">
              This is generated from your title. You can edit it manually.
            </p>

            {errors.slug && (
              <p className="mt-2 text-sm text-red-600">
                {errors.slug.message}
              </p>
            )}
          </div>

          {/* Content editor */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#211D25]">
              Story content
            </label>

            <div className="overflow-hidden rounded-xl border border-[#EAE7E2]">
              <RTE
                name="content"
                control={control}
                defaultValue={getValues("content")}
              />
            </div>
          </div>
        </section>

        {/* Publishing settings */}
        <aside className="space-y-6 lg:sticky lg:top-24">

          {/* Publishing card */}
          <section className="rounded-2xl border border-[#EAE7E2] bg-white p-5 sm:p-6">
            <h2 className="mb-1 text-lg font-semibold text-[#211D25]">
              Publishing
            </h2>

            <p className="mb-5 text-sm text-[#77717C]">
              Manage your story's visibility.
            </p>

            <label className="mb-2 block text-sm font-medium text-[#211D25]">
              Publication status
            </label>

            <Select
              options={["active", "inactive"]}
              {...register("status", { required: true })}
              className="!rounded-xl !border-[#EAE7E2] !py-3 focus:!border-[#7956A8] focus:!ring-2 focus:!ring-[#7956A8]/10"
            />

            <div className="mt-5 border-t border-[#EAE7E2] pt-5">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full !rounded-xl !py-3 !font-semibold"
                bgColor="bg-[#7956A8] hover:bg-[#68458F]"
              >
                {isSubmitting
                  ? "Saving..."
                  : post
                    ? "Update story"
                    : "Publish story"}
              </Button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
                className="mt-3 w-full rounded-xl border border-[#EAE7E2] px-4 py-3 text-sm font-semibold text-[#514B55] transition hover:bg-[#FAF8FB] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </section>

          {/* Featured image card */}
          <section className="rounded-2xl border border-[#EAE7E2] bg-white p-5 sm:p-6">
            <h2 className="mb-1 text-lg font-semibold text-[#211D25]">
              Featured image
            </h2>

            <p className="mb-4 text-sm text-[#77717C]">
              Choose the image that represents your story.
            </p>

            {/* Existing image preview */}
            {currentImage && (
              <div className="mb-4 overflow-hidden rounded-xl border border-[#EAE7E2] bg-[#FAFAF8]">
                <img
                  src={appwriteService.getFilePreview(currentImage)}
                  alt={post?.title || "Current featured image"}
                  className="aspect-[16/10] w-full object-cover"
                />

                <p className="px-3 py-2 text-xs text-[#77717C]">
                  Current featured image
                </p>
              </div>
            )}

            {/* Empty image preview */}
            {!currentImage && (
              <div className="mb-4 flex aspect-[16/10] items-center justify-center rounded-xl border border-dashed border-[#D8D1DF] bg-[#FAF8FB] px-4 text-center text-sm text-[#77717C]">
                Your image preview will appear here after publishing.
              </div>
            )}

            {/* Image upload */}
            <Input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/gif"
              className="!rounded-xl !border-[#EAE7E2] !py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[#F1ECF6] file:px-3 file:py-2 file:font-medium file:text-[#7956A8]"
              {...register("image", {
                validate: (files) => {
                  if (!post && !files?.length) {
                    return "Please select a featured image.";
                  }

                  return true;
                },
              })}
            />

            <p className="mt-2 text-xs text-[#77717C]">
              PNG, JPG or GIF. Leave empty to keep the current image when editing.
            </p>

            {errors.image && (
              <p className="mt-2 text-sm text-red-600">
                {errors.image.message}
              </p>
            )}
          </section>
        </aside>
      </div>
    </form>
  );
}

export default PostForm;