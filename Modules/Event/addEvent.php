<script src="/jq.js"></script>
<script src="addEvent.js"></script>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>ACC Companion</title>
    <link rel="stylesheet" href="../../main.css">
    <link rel="stylesheet" href="../Profile/profile.css">
</head>
<body>

<?php include "../NavBar/navbar.php"?>

<div class="background glass">
    <form>
        <input type="text" name="title" placeholder="Title">
        <select name="track"></select>
        <select name="class"></select>
        <input type="number" name="slots" placeholder="Slots amount">
        <input type="number" name="duration" placeholder="Duration (min)">
        <input type="datetime-local" name="start">
        <input type="button" value="Add" class="submit">
    </form>

    <span id="response"></span>
</div>

</body>
</html>