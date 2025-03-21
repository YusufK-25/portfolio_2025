<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home Page</title>
    <style>
        body {
            background: url('background2.jpeg') no-repeat center center fixed;
            background-size: cover;
            background-attachment: fixed;
            background-position: center;
            image-rendering: crisp-edges; /* Helps with clarity */
            display: flex;
            flex-direction: column;
            align-items: center;
            color: white;
            font-family: Arial, sans-serif;
            height: 100vh;
            margin: 0;
        }
        .container {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            gap: 90px; /* Increased space between left and right columns */
            margin-top: 20px;
            flex-wrap: nowrap;
        }
        .column {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        .box {
            background: rgba(0, 0, 0, 0.7); /* Semi-transparent black */
            padding: 15px;
            border-radius: 10px;
            border: 2px solid black; /* Black border */
            color: white;
            text-align: center;
            width: 500px;
            min-height: 150px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            word-wrap: break-word;
        }
        .box h2 {
            font-size: 2.4em;
        }
        .box p {
            font-size: 1.2em;
        }
        a {
            color: #1E90FF;
            text-decoration: none;
            font-weight: bold;
        }
        a:hover {
            color: #FFD700;
        }
        .right-column {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Left Column with Two Stacked Boxes -->
        <div class="column">
            <div class="box">
                <h2>Meet The Developers</h2>
                <div>
                    <p>Nicolas D.</p>
                    <p>Aria S.</p>
                    <p>Santhosh K.</p>
                    <p>Yusuf K.</p>
                    <p>Rishabh J.</p>
                </div>
            </div>
            <!-- New Box Under "Meet The Developers" -->
            <div class="box">
                <h2>Our Hacks</h2>
                <p>Here is a link to our Hacks page.</p>
            </div>
        </div>
        <!-- Right Column with Two Stacked Boxes -->
        <div class="right-column">
            <div class="box">
                <h2>Ideation</h2>
                <div>
                    <p>Here is a link to our Ideation page:</p>
                    <a href="navigation/ideation">Ideation Page</a>
                </div>
            </div>
            <div class="box">
                <h2>About Us</h2>
                <div>
                    <p>Here is a link to our About Us page:</p>
                    <a href="navigation/aboutOG">About Us</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
