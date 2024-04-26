<?php
session_start();

if (isset($_POST['exit'])) {
    session_unset();
    session_destroy();
    session_start();
    echo json_encode(['result' => 'success']);
}

$host = "127.0.0.1";
$user = "dbeaver";
$password = "dbeaver";
$database = "ACCCompanion";
$port = 3306;

$sql = mysqli_connect($host, $user, $password, $database, $port);

// User

if (isset($_POST['login']) && isset($_POST['password']) && isset($_POST['userRequest'])) {

    $login = $_POST['login'];
    $password = $_POST['password'];
    if ($_POST['userRequest'] == "POST") {
        $isLoginTaken = mysqli_query($sql, "SELECT login FROM Users WHERE login='$login'");
        $loginsDict = mysqli_fetch_assoc($isLoginTaken);
        if ($loginsDict) {
            echo json_encode(['result' => 'taken']);
            return;
        } else {
            $result = mysqli_query($sql,"INSERT INTO Users (id, login, password) VALUES (default, '$login', '$password')");
            if ($result) {
                if (checkUser($sql, $login, $password)) {
                    echo json_encode(['result' => 'success']);
                } else {
                    echo json_encode(['result' => 'failed']);
                }
            } else {
                echo json_encode(['result' => 'error']);
            }
        }
    } else if ($_POST['userRequest'] == "GET") {
        if (checkUser($sql, $login, $password)) {
            echo json_encode(['result' => 'success']);
        } else {
            echo json_encode(['result' => 'error']);
        }
    }
}

if (isset($_GET['userRequest'])) {
    if ($_GET['userRequest'] == "isSignedIn") {
        if (isset($_SESSION['id'])) {
            echo json_encode(['result' => 'success']);
        } else {
            echo json_encode(['result' => 'error']);
        }
    }
}

if (isset($_GET['deleteUser'])) {
    $id = intval($_SESSION['id']);
    $result = mysqli_query($sql, "DELETE FROM Users WHERE id=$id");
    if ($result) {
        session_unset();
        session_destroy();
        session_start();
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(["success" => false]);
    }
}

if (isset($_GET['getName'])) {
    if (isset($_SESSION['login'])) {
        echo json_encode(['result' => $_SESSION['login']]);
    } else {
        echo json_encode(['result' => 'error']);
    }
}

// Add Event
if (isset($_POST['title']) &&
    isset($_POST['trackId']) &&
    isset($_POST['classId']) &&
    isset($_POST['slots']) &&
    isset($_POST['duration']) &&
    isset($_POST['start'])) {

    $createdBy = $_SESSION['id'] ?? null;
    $title = $_POST['title'];
    $track = intval($_POST['trackId']);
    $class = intval($_POST['classId']);
    $slots = intval($_POST['slots']);
    $duration = intval($_POST['duration']);
    $start = date("Y-m-d H:i:s",strtotime($_POST['start']));

    if ($createdBy != null and $title != null and $track > 0 and $class > 0 and $slots > 0 and $duration > 0) {
        $request = mysqli_query($sql,
            "INSERT INTO Events VALUES (default, '$title', $track, $class, $slots, $duration, $createdBy, '$start');");
        if ($request) {
            echo json_encode(['result' => 'success']);
        } else {
            echo json_encode(['result' => 'error']);
        }
    } else {
        echo json_encode(['result' => 'wrong_data']);
    }
}

if (isset($_GET['getEvents'])) {
    $request = $_GET['getEvents'];
    switch ($request) {
        case 'all':
            $query = generateQuery($_SESSION['id'] ?? -1, "");
            $result = mysqli_query($sql, $query);
            $allEvents = mysqli_fetch_all($result, MYSQLI_ASSOC);
            echo json_encode($allEvents);
            break;
        case 'created':
            $id = $_SESSION['id'];
            $query = generateQuery($_SESSION['id'] ?? -1, " WHERE createdBy=$id");
            $result = mysqli_query($sql, $query);
            $allEvents = mysqli_fetch_all($result, MYSQLI_ASSOC);
            echo json_encode($allEvents);
            break;
        case 'entered':
            $id = $_SESSION['id'];
            $query = generateQuery($_SESSION['id'] ?? -1, " WHERE user_id=$id");
            $result = mysqli_query($sql, $query);
            $allEvents = mysqli_fetch_all($result, MYSQLI_ASSOC);
            echo json_encode($allEvents);
            break;
    }
}

if (isset($_POST['deleteEvent'])) {
    $eventIdToDelete = intval($_POST['deleteEvent']);
    $title = mysqli_query($sql, "SELECT title FROM Events WHERE id=$eventIdToDelete");
    $title = mysqli_fetch_assoc($title);
    $title = $title['title'];
    $result = mysqli_query($sql, "DELETE FROM Events WHERE id=$eventIdToDelete");
    if ($result) {
        echo json_encode(['success' => true, 'title' => $title]);
    } else {
        echo json_encode(["success" => false]);
    }
}

if (isset($_POST['eventRequest']) && isset($_POST['eventId'])) {
    $eventId = intval($_POST['eventId']);
    $userId = intval($_SESSION['id']);

    if ($_POST['eventRequest'] == 'POST') {
        $result = mysqli_query($sql, "INSERT INTO Registration VALUES (default, $eventId, $userId)");
    } else if ($_POST['eventRequest'] == 'DELETE') {
        $result = mysqli_query($sql, "DELETE FROM Registration WHERE event_id=$eventId and user_id=$userId");
    } else {
        echo json_encode(["success" => false]);
        return;
    }

    if ($result) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false]);
    }
}

if (isset($_GET['RaceLength']) && isset($_GET['Minutes']) && isset($_GET['Seconds']) && isset($_GET['Consumption'])) {
    $length = floatval($_GET['RaceLength']) ?? null;
    $minutes = floatval($_GET['Minutes']) ?? null;
    $seconds = floatval($_GET['Seconds']) ?? null;

    $consumption = floatval(str_replace(',', '.', $_GET['Consumption'])) ?? null;

    if ($length != 0 and $consumption != 0 and ($minutes != 0 or $seconds != 0)) {
        $totalLaps = intval(ceil($length * 60 / ($minutes * 60 + $seconds)));
        $minimumFuel = intval(ceil($totalLaps * $consumption));
        $fuelForWarmup = $consumption * 1.8;
        $recommendedFuel = intval(ceil(($totalLaps+1) * $consumption));
        $safe = intval(ceil(($totalLaps+1) * $consumption + $fuelForWarmup));
        echo json_encode([
            'success' => true,
            'totalLaps' => $totalLaps,
            'minimumFuel' => $minimumFuel,
            'fuelForWarmup' => $fuelForWarmup,
            'recommendedFuel' => $recommendedFuel,
            'safe' => $safe
        ]);
    } else {
        echo json_encode(["success" => false]);
    }
}

if (isset($_GET['getTracks'])) {
    $tracks = mysqli_query($sql, "SELECT * FROM Tracks");
    $allTracks = mysqli_fetch_all($tracks, MYSQLI_ASSOC);
    echo json_encode($allTracks);
}

if (isset($_GET['getClass'])) {
    $class = mysqli_query($sql, "SELECT * FROM Classes");
    $allClass = mysqli_fetch_all($class, MYSQLI_ASSOC);
    echo json_encode($allClass);
}

function checkUser($sql, $login, $password) {
    $check = mysqli_query($sql, "SELECT id, login FROM Users WHERE login='$login' and password='$password'");
    $checkDict = mysqli_fetch_assoc($check);
    if ($checkDict) {
        $_SESSION['id'] = $checkDict['id'];
        $_SESSION['login'] = $checkDict['login'];
        return true;
    } else {
        return false;
    }
}

function generateQuery($userId, $add)
{
    $query = "SELECT
    Events.id as id,
    title,
    Tracks.track as track,
    Classes.class as class,
    slots,
    duration,
    start,
    (JSON_CONTAINS(JSON_ARRAYAGG(Registration.user_id), '{$userId}')) AS is_registered
FROM Events
         JOIN Classes ON Events.class = Classes.id
         JOIN Tracks ON Events.track = Tracks.id
         LEFT JOIN Registration on Registration.event_id = Events.id";
    $query = $query.$add;
    $query = $query." GROUP BY id, title, Events.track, Events.class, slots, duration, start";
    return $query;
}

// --Admin--

if (isset($_POST['isAdminSignedIn'])) {
    if (isset($_SESSION['admin'])) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false]);
    }
}

if (isset($_POST['lgn']) && isset($_POST['pswd'])) {
    $admLgn = $_POST['lgn'];
    $admPswd = $_POST['pswd'];

    $check = mysqli_query($sql, "SELECT * FROM Admins WHERE login='$admLgn' AND password='$admPswd'");
    if (mysqli_fetch_assoc($check)) {
        $_SESSION['admin'] = $admLgn;
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false]);
    }
}

if (isset($_POST['classesToDelete'])) {
    $classesToDelete = $_POST['classesToDelete'];
    $titles = [];
    foreach ($classesToDelete as $class) {
        $title = mysqli_query($sql, "SELECT class FROM Classes WHERE id='$class'");
        $title = mysqli_fetch_assoc($title);
        array_push($titles, $title['class']);
        mysqli_query($sql, "DELETE FROM Classes WHERE id=$class");
    }
    echo json_encode(["success" => true, 'titles' => $titles]);
}
if (isset($_POST['tracksToDelete'])) {
    $tracksToDelete = $_POST['tracksToDelete'];
    $titles = [];
    foreach ($tracksToDelete as $track) {
        $title = mysqli_query($sql, "SELECT track FROM Tracks WHERE id='$track'");
        $title = mysqli_fetch_assoc($title);
        array_push($titles, $title['track']);
        mysqli_query($sql, "DELETE FROM Tracks WHERE id=$track");
    }
    echo json_encode(["success" => true, 'titles' => $titles]);
}
if (isset($_POST['tireToDelete'])) {
    $pressureToDelete = $_POST['tireToDelete'];
    $titles = [];
    foreach ($pressureToDelete as $tire) {
        $title = mysqli_query($sql, "SELECT class FROM TirePressure WHERE id='$tire'");
        $title = mysqli_fetch_assoc($title);
        array_push($titles, $title['class']);
        mysqli_query($sql, "DELETE FROM TirePressure WHERE id=$tire");
    }
    echo json_encode(["success" => true, 'titles' => $titles]);
}
if (isset($_POST['admin'])) {
    $admin = $_POST['admin'];
    $result = mysqli_query($sql, "DELETE FROM Admins WHERE id=$admin");

    if ($result) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false]);
    }
}

if (isset($_POST['newClass'])) {
    $newClass = $_POST['newClass'];
    $result = mysqli_query($sql, "INSERT INTO Classes VALUES (default, '$newClass')");

    if ($result) {
        echo json_encode(["success" => true, 'class' => $newClass]);
    } else {
        echo json_encode(["success" => false]);
    }
}
if (isset($_POST['newTrack'])) {
    $newTrack = $_POST['newTrack'];
    $result = mysqli_query($sql, "INSERT INTO Tracks VALUES (default, '$newTrack')");

    if ($result) {
        echo json_encode(["success" => true, 'track' => $newTrack]);
    } else {
        echo json_encode(["success" => false]);
    }
}

if (isset($_POST['pressureClass']) && isset($_POST['fmi']) && isset($_POST['fma']) && isset($_POST['rmi']) && isset($_POST['rma'])) {
    $classPres = $_POST['pressureClass'];
    $fmi = $_POST['fmi'];
    $fma = $_POST['fma'];
    $rmi = $_POST['rmi'];
    $rma = $_POST['rma'];

    if (isset($_POST['updateTire'])) {
        $pressureToUpdate = $_POST['updateTire'];
        $previousTire = mysqli_query($sql, "SELECT * FROM TirePressure WHERE id=$pressureToUpdate");
        $previousTire = mysqli_fetch_assoc($previousTire);
        $result = mysqli_query($sql, "UPDATE TirePressure SET class='$classPres', frontMin='$fmi', frontMax='$fma', rearMin='$rmi', rearMax='$rma' WHERE id=$pressureToUpdate");
        $newTire = mysqli_query($sql, "SELECT * FROM TirePressure WHERE id=$pressureToUpdate");
        $newTire = mysqli_fetch_assoc($newTire);
        if ($result) {
            echo json_encode(["success" => true, 'newTire' => $newTire, 'previousTire' => $previousTire]);
        } else {
            echo json_encode(["success" => false]);
        }
    } else {
        $result = mysqli_query($sql, "INSERT INTO TirePressure VALUES (default, '$classPres', '$fmi', '$fma', '$rmi', '$rma')");
        if ($result) {
            echo json_encode(["success" => true, 'class' => $classPres, 'fmi' => $fmi, 'fma' => $fma, 'rma' => $rma, 'rmi' => $rmi]);
        } else {
            echo json_encode(["success" => false]);
        }
    }
}

if (isset($_POST['adminLogin']) and isset($_POST['adminPassword'])) {
    $login = $_POST['adminLogin'];
    $password = $_POST['adminPassword'];
    $result = mysqli_query($sql, "INSERT INTO Admins VALUES (default, '$login', '$password')");
    if ($result) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false]);
    }
}

if (isset($_POST['getPressure'])) {
    $result = mysqli_query($sql, "SELECT * FROM TirePressure");
    if ($result) {
        $all = mysqli_fetch_all($result, MYSQLI_ASSOC);
        echo json_encode(["success" => true, "data" => $all]);
    } else {
        echo json_encode(["success" => false]);
    }
}

if (isset($_POST['getAdmins'])) {
    if (isset($_SESSION['admin'])) {
        $admin = $_SESSION['admin'];
        $query = "SELECT * FROM Admins WHERE login != '$admin'";
        $result = mysqli_query($sql, $query);
        if ($result) {
            $all = mysqli_fetch_all($result, MYSQLI_ASSOC);
            echo json_encode(["success" => true, "data" => $all]);
        } else {
            echo json_encode(["success" => false]);
        }
    } else {
        echo json_encode(["success" => false]);
    }
}
