<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home Page</title>
    <style>
        body {
            background: url('background.png') no-repeat center center fixed;
            background-size: cover;
            display: flex;
            flex-direction: column;
            align-items: center;
            color: white;
            font-family: Arial, sans-serif;
            height: 100vh;
            margin: 0;
        }
        .header {
            width: 100%;
            background: #222;
            padding: 20px;
            text-align: center;
            font-size: 32px;
            font-weight: bold;
        }
        .container {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            gap: 20px;
            margin-top: 20px;
            flex-wrap: nowrap;
        }
        .box {
            background: #333;
            padding: 15px;
            border-radius: 10px;
            border: 2px solid white;
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
        <!-- Left Box -->
        <div class="box">
            <h2>Meet The Developers</h2>
            <div>
                <p>Nicolas D.</p>
                <p>Aria S.</p>
                <p>Santhosh K.</p>
                <p>Yusuf K.</p>
                <p>Dylan C.</p>
                <p>Rishabh J.</p>
            </div>
        </div>

        <!-- Right Column with two stacked boxes -->
        <div class="right-column">
            <div class="box">
                <h2>Ideation</h2>
                <div>
                    <p>Here is a link to our Ideation page:</p>
                    <a href="navigation/ideation">Ideation Page</a>
                </div>
            </div>
            <div class="box">
                <h2>About US</h2>
                <div>
                    <p>Here is a link to our About Us page:</p>
                    <a href="navigation/aboutOG">About Us</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
