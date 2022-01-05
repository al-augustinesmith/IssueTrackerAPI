import { Router } from "express";
import path from "path";
const pages = Router();
pages
.get("/", (req, res) => {
    res.sendFile(
      path.join(__dirname, "../../../UI/index.html")
    );
  })
  .get("/menu", (req, res) => {
    res.sendFile(
      path.join(
        __dirname,
        "../../../UI/menu.html"
      )
    );
  })
  .get("/footer", (req, res) => {
    res.sendFile(
      path.join(
        __dirname,
        "../../../UI/footer.html"
      )
    );
  })
  .get("/login", (req, res) => {
    res.sendFile(
      path.join(
        __dirname,
        "../../../UI/user.html"
      )
    );
  })
  .get("/dashboard", (req, res) => {
    res.sendFile(
      path.join(
        __dirname,
        "../../../UI/dashboard.html"
      )
    );
  })
  .get("/beers", (req, res) => {
    res.sendFile(
      path.join(
        __dirname,
        "../../../UI/beers.html"
      )
    );
  })
  .get("/order", (req, res) => {
    res.sendFile(
      path.join(
        __dirname,
        "../../../UI/order.html"
      )
    );
  })
  .get("/louange", (req, res) => {
    res.sendFile(
      path.join(
        __dirname,
        "../../../UI/louange.html"
      )
    );
  })
  .get("/contact", (req, res) => {
    res.sendFile(
      path.join(
        __dirname,
        "../../../UI/contact.html"
      )
    );
  })
export default pages;
