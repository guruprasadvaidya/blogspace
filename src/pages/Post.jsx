
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/configuration";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);

  // Appwrite table columns are lowercase: userid and featuredimage.
  const isAuthor =
    post && userData
      ? post.userid === userData.$id
      : false;

  useEffect(() => {
    if (!slug) {
      navigate("/");
      return;
    }

    appwriteService.getPost(slug).then((postData) => {
      if (postData) {
        setPost(postData);
      } else {
        navigate("/");
      }
    });
  }, [slug, navigate]);

  const deletePost = async () => {
    if (!post) return;

    const status = await appwriteService.deletePost(post.$id);

    if (status) {
      if (post.featuredimage) {
        await appwriteService.deleteFile(post.featuredimage);
      }

      navigate("/");
    }
  };

  return post ? (
    <div className="py-8">
      <Container>
        <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
          {post.featuredimage ? (
            <img
              src={appwriteService.getFilePreview(post.featuredimage)}
              alt={post.title}
              className="rounded-xl"
            />
          ) : (
            <div>No featured image available.</div>
          )}

          {isAuthor && (
            <div className="absolute right-6 top-6">
              <Link to={`/edit-post/${post.slug}`}>
                <Button
                  bgColor="bg-green-500"
                  className="mr-3"
                >
                  Edit
                </Button>
              </Link>

              <Button
                bgColor="bg-red-500"
                onClick={deletePost}
              >
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="w-full mb-6">
          <h1 className="text-2xl font-bold">{post.title}</h1>
        </div>

        <div className="browser-css">
          {parse(post.content)}
        </div>
      </Container>
    </div>
  ) : null;
}
