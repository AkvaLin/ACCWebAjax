<script src="/jq.js"></script>
<script src="profile.js"></script>

<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>ACC Companion</title>
    <link rel="stylesheet" href="/main.css">
    <link rel="stylesheet" href="profile.css">
</head>
<body>
<?php include '../NavBar/navbar.php'; ?>

<div class="glass" id="background">
    <!--SIGN IN/SIGN UP-->
    <div class="signInContainer">
        <form>
            <input type='text' name='login' placeholder='login'>
            <input type='password' name='password' placeholder='password'>
            <input type='password' name='password2' placeholder='repeat password'>
            <input type='button' class="submit" value='Sign Up' id="signUp">
            <input type='button' class="submit" value='Sign In' id="signIn">
        </form>
        <input type="button" class='light' value="Sign Up" id="navSignUp">
        <input type="button" class='light' value="Sign In" id="navSignIn">
    </div>
    <!--PROFILE-->
    <div class='profileContainer'>
        <div class='profileInfo'>
            <h1 id="username"></h1>
            <a href='/Modules/Event/addEvent.php' class='addEventButton'>Add event</a>
            <form>
                <input type='button' value='Exit' class='submit exit' id="exit">
            </form>
            <input type="button" class="delete" value="Delete account" id="deleteAccount">
        </div>
        <div class="eventsInfo">
            <h1>Created events</h1>
            <div class="eventsInfoContainer" id="createdEvents">

            </div>
            <h1>Entered events</h1>
            <div class='eventsInfoContainer' id="enteredEvents">

            </div>
        </div>
    </div>
</div>
</body>
</html>