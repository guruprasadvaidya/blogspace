import React, { useEffect, useState } from "react";
import { Container, PostForm } from "../components";
import appwriteService from "../appwrite/configuration";
import { useNavigate, useParams } from "react-router-dom";

function EditPost() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchPost = async () => {
      if (!slug) {
        navigate("/", { replace: true });
        return;
      }

      try {
        const postData = await appwriteService.getPost(slug);

        if (!isMounted) return;

        if (postData) {
          setPost(postData);
        } else {
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Error fetching post for editing:", error);

        if (isMounted) {
          navigate("/", { replace: true });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPost();

    return () => {
      isMounted = false;
    };
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#FAFAF8]">
        <p className="text-sm font-medium text-[#77717C]">
          Loading your story...
        </p>
      </div>
    );
  }

  return post ? (
    <div className="min-h-screen bg-[#FAFAF8] py-8 sm:py-12">
      <Container>
        <PostForm post={post} />
      </Container>
    </div>
  ) : null;
}

export default EditPost;