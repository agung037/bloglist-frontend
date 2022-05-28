import React from "react"
import "@testing-library/jest-dom/extend-expect"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Blog from "./Blog"

const loggedUser = {
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImtpbWkiLCJpZCI6IjYyNDU3M2ZjZDE4NGQyOGFkNGRkM2IxZiIsImlhdCI6MTY1MTAwMDMyOX0.Hba_im54HxdjbOpK3f-IclpYyNwMLaNfexl9kXkiuHk",
  username: "kimi",
  name: "Kimi Räikkönen",
}

const blog = {
  title: "The testing blog title",
  author: "Young Guy",
  url: "google.com",
  likes: 159,
  user: {
    username: "lando",
    name: "Lando Norris",
    id: "623d9630d783bfd80a74d117",
  },
  id: "623dc4986f7cf96022d4991b",
}

test("render blog title", async () => {
  render(<Blog blog={blog} />)

  const element = await screen.getByText("The testing blog title", {
    exact: false,
  })
  expect(element).toBeDefined()
})

test("render blog author", async () => {
  render(<Blog blog={blog} />)

  const element = await screen.getByText("Young Guy", {
    exact: false,
  })
  expect(element).toBeDefined()
})

test("not showing the url by default", async () => {
  const { container } = render(<Blog blog={blog} />)
  const div = container.querySelector(".blog-url")
  expect(div).toBeNull() // memastikan class blog-url tidak tersedia
})

test("show blog url and like count when, show button clicked", async () => {
  const { container } = render(<Blog blog={blog} />)
  const button = container.querySelector(".blog-button")
  const user = userEvent.setup()

  await user.click(button)
  const theUrl = await screen.getByText("google.com", { exact: false })
  const likeCount = await screen.getByText("likes 159", { exact: false })
  expect(theUrl).toBeDefined()
  expect(likeCount).toBeDefined()
})

test("clicking the like button twice", async () => {
  const { container } = render(<Blog blog={blog} user={loggedUser} />)
  const showButton = container.querySelector(".blog-button")
  const user = userEvent.setup()
  await user.click(showButton) // click show button

  // like button akan muncul
  const likeButton = container.querySelector(".like-button")

  await user.click(likeButton)
  await user.click(likeButton)

  await screen.getByText("likes 161")
})
