
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from "../index";
import appWriteService from "../../appwrite/configuration";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PostForm({ post }) {
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

  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);

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

  // Watch title changes
  const title = watch("title");

  useEffect(() => {
    if (title !== undefined) {
      setValue("slug", slugTransform(title), {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [title, setValue]);

  const submit = async (data) => {
    try {
      let fileId = post?.featuredimage || post?.featuredImage || "";

      // Upload a new image if selected
      const file = data.image?.[0];

      if (file) {
        const uploadedFile = await appWriteService.uploadFile(file);

        if (!uploadedFile) {
          throw new Error("Featured image upload failed.");
        }

        fileId = uploadedFile.$id;
      }

      if (!fileId) {
        throw new Error("Please select a featured image.");
      }

      const postData = {
        title: data.title,
        slug: slugTransform(data.slug),
        content: data.content,
        featuredImage: fileId,
        status: data.status,
      };

      let dbPost;

      if (post) {
        dbPost = await appWriteService.updatePost(
          post.$id,
          postData
        );

        if (dbPost && file && post.featuredimage) {
          await appWriteService.deleteFile(post.featuredimage);
        }
      } else {
        dbPost = await appWriteService.createPost({
          ...postData,
          userId: userData?.$id,
        });
      }

      if (!dbPost) {
        throw new Error("Post could not be saved. Check the Appwrite errors.");
      }

      navigate(`/post/${dbPost.slug}`);
    } catch (error) {
      console.error("Post submission failed:", error);
      alert(error.message || "Something went wrong.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="flex flex-wrap"
    >
      <div className="w-2/3 px-2">
        <Input
          label="Title:"
          placeholder="Enter post title"
          className="mb-4"
          {...register("title", { required: "Title is required" })}
        />

        <Input
          label="Slug:"
          placeholder="Enter slug"
          className="mb-4"
          {...register("slug", { required: "Slug is required" })}
        />

        <RTE
          label="Content:"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>

      <div className="w-1/3 px-2">
        <Input
          label="Featured Image:"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", {
            required: !post ? "Featured image is required" : false,
          })}
        />

        {post && (post.featuredimage || post.featuredImage) && (
          <div className="w-full mb-4">
            <img
              src={appWriteService.getFilePreview(
                post.featuredimage || post.featuredImage
              )}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}

        <Select
          options={["active", "inactive"]}
          label="Status:"
          className="mb-4"
          {...register("status", { required: true })}
        />

        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : "bg-blue-600"}
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : post
              ? "Update"
              : "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default PostForm;
