import blogs from "../../src/services/blogs"

/* eslint-disable no-undef */
describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset")
    cy.request("POST", "http://localhost:3003/api/users", {
      username: "kimi",
      name: "Kimi Räikkönen",
      password: "salainen",
    })
    cy.visit("http://localhost:3000")
  })

  it("Login form is shown", function () {
    cy.contains("Login").click()
    cy.contains("username")
    cy.contains("password")
  })

  describe("Login", function () {
    it("success with corrrect credentials", function () {
      cy.contains("Login").click()
      cy.get("#username").type("kimi")
      cy.get("#password").type("salainen")
      cy.get("#login-button").click()
      cy.contains("Kimi")
    })

    it("fails with wrong credentials", function () {
      cy.contains("Login").click()
      cy.get("#username").type("kimi")
      cy.get("#password").type("wrong")
      cy.get("#login-button").click()
      cy.contains("Username / Password Incorrect")
    })
  })

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "kimi", password: "salainen" })
      cy.createBlog({
        title: "Normal day in Berlin",
        author: "Jackson",
        url: "http://google.com",
        likes: 10,
        user: blogs.user,
      })
      cy.createBlog({
        title: "South Pole Joe",
        author: "Joe",
        url: "http://google.com",
        likes: 0,
        user: blogs.user,
      })
      cy.createBlog({
        title: "Lisa the Great",
        author: "Jackson",
        url: "http://google.com",
        likes: 5,
        user: blogs.user,
      })
      cy.createBlog({
        title: "Dimitri the learner",
        author: "Daisy",
        url: "http://google.com",
        likes: 16,
        user: blogs.user,
      })
      cy.createBlog({
        title: "Art of Lead",
        author: "Daisy",
        url: "http://google.com",
        likes: 6,
        user: blogs.user,
      })
    })

    it("A blog can be created", function () {
      cy.createBlog({
        title: "New Blog From tester",
        author: "Nirina",
        url: "http://google.com",
        likes: 1,
        user: blogs.id,
      })
    })

    it("Can like a blog", function () {
      cy.contains("South Pole Joe").find("button").click()
      cy.contains("South Pole Joe").get(".like-button").click()
      cy.contains("likes 1")
    })

    it("Can delete a blog", function () {
      cy.contains("Normal day in Berlin").find("button").click()
      cy.contains("Normal day in Berlin").get(".delete").click()
    })

    it("Can order the blog according the most like", function () {
      cy.get(".blogs").eq(0).should("contain", "Dimitri the learner")
      cy.get(".blogs").eq(-1).should("contain", "South Pole Joe")
    })
  })
})
