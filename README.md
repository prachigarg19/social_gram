<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css">
</head>
<body>
  <h1>Social Gram</h1>

  <p><a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a></p>

  <p>Social Gram is a social media platform that allows users to share photos, connect with friends, and explore trending content.</p>

  <h2>Features</h2>
  <ul>
    <li>User registration and authentication.</li>
    <li>Upload and share photos with captions.</li>
    <li>Follow and connect with other users.</li>
    <li>Discover trending content and popular photos.</li>
    <li>Like and dislike on photos.</li>
    <li>Responsive design for seamless use on different devices.</li>
  </ul>
  
  <h2>Architecture</h2>
  <p>The Social Gram application consists of two main components:</p>
  <ul>
    <li><strong>Frontend:</strong> Built with ReactJS and styled using CSS. It provides the user interface and handles user interactions.</li>
    <li><strong>Backend:</strong> Developed using Node.js and Express. It handles user authentication, database operations using MongoDB, and interacts with Firebase for image storage.</li>
  </ul>

<!--   <h2>Demo</h2>
  <p>You can find a live demo of Social Gram <a href="https://example.com">here</a>.</p> -->


  <h2>Installation</h2>
  <ol>
    <li>Clone the repository:<br>
      <code>git clone https://github.com/prachigarg19/social_gram.git</code></li>
    <li>Install the dependencies for the backend:<br>
      <code>cd social_gram/api && npm install</code></li>
    <li>Install the dependencies for the frontend:<br>
      <code>cd ../client && npm install</code></li>
    <li>Configure the environment variables by creating a <code>.env</code> file based on the provided templates in the <code>backend</code> and <code>frontend</code> directories.</li>
    <li>Start the backend server:<br>
      <code>npm start</code></li> for development mode</li>
    <li>Start the frontend development server:<br>
      <code>npm start</code></li>
    <li>Access the application at <code>http://localhost:3000</code>.</li>
  </ol>

  <h2>Contributing</h2>
  <p>Contributions are welcome! To contribute to Social Gram, follow these steps:</p>
  <ol>
    <li>Fork the repository.</li>
    <li>Create a new branch for your feature or bug fix:<br>
      <code>git checkout -b feature/your-feature-name</code></li>
    <li>Make your modifications and commit your changes:<br>
      <code>git commit -m "Add your commit message here"</code></li>
    <li>Push your changes to your forked repository:<br>
      <code>git push origin feature/your-feature-name</code></li>
    <li>Open a pull request, explaining your changes and any related information.</li>
  </ol>
</body>
</html>
