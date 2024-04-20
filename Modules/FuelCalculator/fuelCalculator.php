<script src="/jq.js"></script>
<script src="fuelCalculator.js"></script>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Fuel Calculator</title>
    <link rel="stylesheet" href="../../main.css">
    <link rel="stylesheet" href="fuelCalculator.css">
</head>
<body>

    <div>
        <?php
            include '../NavBar/navbar.php'
        ?>
    </div>

    <div class="background glass">
        <div class="container">
            <form>
                <label for="RaceLength">Race length (min)</label>
                <input type="text" name="RaceLength" id="RaceLength" placeholder="60" required>

                <label>Lap Time</label>

                <div>
                    <input type="text" name="Minutes" placeholder="1" class="time" required>
                    <label> : </label>
                    <input type="text" name="Seconds" placeholder="47" class="time" required>
                </div>

                <label for="Consumption">Consumption</label>
                <input type="text" name="Consumption" id="Consumption" placeholder="3.2" required>

                <input type="button" value="Submit" id="submit">
            </form>

            <div class='results'></div>
        </div>
    </div>
</body>
</html>