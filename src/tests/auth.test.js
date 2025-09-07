import request from "supertest";
import { app } from "../app.js";
import { User } from "../models/user.models.js";
import { emailService } from "../utils/mail.js";

describe("Email Verification Flow", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("should send verification email on registration", async () => {
    const userData = {
      email: "test@example.com",
      username: "testuser",
      password: "Password123!",
    };

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body.message).toContain("Please check your email");
    
    const user = await User.findOne({ email: userData.email });
    expect(user.emailVerificationToken).toBeDefined();
    expect(user.emailVerificationExpiry).toBeDefined();
    expect(user.isEmailVerified).toBeFalsy();
  });

  it("should verify email with valid token", async () => {
    const user = await User.create({
      email: "test@example.com",
      username: "testuser",
      password: "Password123!",
      emailVerificationToken: "validtoken",
      emailVerificationExpiry: new Date(Date.now() + 3600000),
    });

    const response = await request(app)
      .get(`/api/v1/auth/verify-email/${user.emailVerificationToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Email verified successfully");
    
    const updatedUser = await User.findById(user._id);
    expect(updatedUser.isEmailVerified).toBeTruthy();
    expect(updatedUser.emailVerificationToken).toBeUndefined();
    expect(updatedUser.emailVerificationExpiry).toBeUndefined();
  });

  it("should reject invalid verification tokens", async () => {
    const response = await request(app)
      .get("/api/v1/auth/verify-email/invalidtoken");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid or expired verification token");
  });

  it("should prevent login without email verification", async () => {
    const userData = {
      email: "test@example.com",
      username: "testuser",
      password: "Password123!",
    };

    await User.create({
      ...userData,
      isEmailVerified: false,
    });

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: userData.email,
        password: userData.password,
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toContain("Please verify your email");
  });
});