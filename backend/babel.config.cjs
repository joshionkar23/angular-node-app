module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "20" } }],
    "@babel/preset-typescript"
  ],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./src"],
        alias: {
          "@": "./src"
        }
      }
    ]
  ]
};
