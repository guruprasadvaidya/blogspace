import React from "react";
import { Container, PostForm } from "../components";

function AddPost() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] py-8 sm:py-12">
      <Container>
        <PostForm />
      </Container>
    </div>
  );
}

export default AddPost;