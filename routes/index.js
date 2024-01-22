const router = require("express").Router()
const { authenticate } = require("../utils/AuthenticateToken")
const authRoutes = require("./auth.controller")

router.use("/auth", authRoutes)

module.exports = router

