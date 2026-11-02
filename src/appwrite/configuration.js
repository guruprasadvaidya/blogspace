
import config from "../config/config.js";

import {
  Client,
  ID,
  TablesDB,
  Storage,
  Query,
  Permission,
  Role,
} from "appwrite";

export class Service {
  client = new Client();
  tablesDB;
  bucket;

  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);

    this.tablesDB = new TablesDB(this.client);
    this.bucket = new Storage(this.client);
  }

  // Create a new post
  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      return await this.tablesDB.createRow({
        databaseId: config.appwriteDatabaseId,
        tableId: config.appwriteCollectionId,
        rowId: ID.unique(),

        data: {
          title,
          slug,
          content,
          featuredimage: featuredImage,
          status,
          userid: userId,
        },

        // Row-level permissions
        permissions: [
          Permission.read(Role.any()),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId)),
        ],
      });
    } catch (error) {
      console.error("Appwrite service :: createPost :: error", error);
      return false;
    }
  }

  // Update an existing post
  async updatePost(rowId, postData) {
    try {
      return await this.tablesDB.updateRow({
        databaseId: config.appwriteDatabaseId,
        tableId: config.appwriteCollectionId,
        rowId,
        data: {
          title: postData.title,
          slug: postData.slug,
          content: postData.content,
          featuredimage: postData.featuredImage,
          status: postData.status,
        },
      });
    } catch (error) {
      console.error("Appwrite service :: updatePost :: error", error);
      return false;
    }
  }

  // Delete a post
  async deletePost(rowId) {
    try {
      await this.tablesDB.deleteRow({
        databaseId: config.appwriteDatabaseId,
        tableId: config.appwriteCollectionId,
        rowId,
      });

      return true;
    } catch (error) {
      console.error("Appwrite service :: deletePost :: error", error);
      return false;
    }
  }

  // Get a single post using its slug
  async getPost(slug) {
    try {
      const response = await this.tablesDB.listRows({
        databaseId: config.appwriteDatabaseId,
        tableId: config.appwriteCollectionId,
        queries: [Query.equal("slug", slug)],
      });

      return response.rows.length > 0 ? response.rows[0] : null;
    } catch (error) {
      console.error("Appwrite service :: getPost :: error", error);
      return null;
    }
  }

  // Get all active posts
  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.tablesDB.listRows({
        databaseId: config.appwriteDatabaseId,
        tableId: config.appwriteCollectionId,
        queries,
      });
    } catch (error) {
      console.error("Appwrite service :: getPosts :: error", error);
      return false;
    }
  }

  // Upload an image
  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        config.appwriteBucketId,
        ID.unique(),
        file
      );
    } catch (error) {
      console.error("Appwrite service :: uploadFile :: error", error);
      return false;
    }
  }

  // Delete an image
  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(config.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.error("Appwrite service :: deleteFile :: error", error);
      return false;
    }
  }

  // Get original image without transformations
  getFilePreview(fileId) {
    return this.bucket.getFileView(
      config.appwriteBucketId,
      fileId
    );
  }
}

const appwriteService = new Service();

export default appwriteService;
