
import React, { useState, useEffect } from "react";
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
    return <div className="py-8 text-center">Loading post...</div>;
  }

  return post ? (
    <div className="py-8">
      <Container>
        <PostForm post={post} />
      </Container>
    </div>
  ) : null;
}

export default EditPost;
