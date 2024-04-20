<script src="/jq.js"></script>
<script src="admn.js"></script>

<!DOCTYPE html>
<html lang='en' xmlns="http://www.w3.org/1999/html">
<head>
    <meta charset='UTF-8'>
    <title>Dangerous</title>
    <link rel="stylesheet" href="/main.css">
    <link rel="stylesheet" href="/Modules/Profile/profile.css">
    <link rel="stylesheet" href="admn.css">
</head>
<body>
<div class="bck">
    <div class="adminPanel">
        <input type="button" class="light" value="Exit" id="exit">
        <div class='admnGrid'>
            <hr class="roundedExtended"><hr class="rounded">

            <!--            Classes-->

            <h1>Classes</h1>
            <div></div>
            <div>
                <h4>Delete classes</h4>
                <table>
                    <thead>
                    <tr>
                        <td><div class='tableItem'></div></td>
                        <td><div class='tableItem'><b>ID</b></div></td>
                        <td><div class='tableItem'><b>CLASS</b></div></td>
                    </tr>
                    </thead>
                    <tbody id="classesBody"></tbody>
                </table>
            </div>
            <div>
                <h4>Add class</h4>
                <input type='text' name='newClass' placeholder='New class name' id="addClassTextField">
            </div>
            <div>
                <input type='button' value='Delete selected' class="inputButton submit">
            </div>
            <div>
                <input type='button' value='Add class' class="inputButton submit" id="addClassButton">
            </div>
            <hr class="roundedExtended"><hr class="rounded">

            <!--            Tracks-->

            <h1>Tracks</h1>
            <div></div>
            <div>
                <h4>Delete tracks</h4>
                <table>
                    <thead>
                    <tr>
                        <td><div class='tableItem'></div></td>
                        <td><div class='tableItem'><b>ID</b></div></td>
                        <td><div class='tableItem'><b>TRACK</b></div></td>
                    </tr>
                    </thead>
                    <tbody id="tracksBody"></tbody>
                </table>
            </div>
            <div>
                <h4>Add track</h4>
                <input type='text' name='newTrack' placeholder='New track name' id="addTrackTextField">
            </div>
            <div>
                <input type='button' value='Delete selected' class="inputButton submit">
            </div>
            <div>
                <input type='button' value='Add track' class="inputButton submit" id="addTrackButton">
            </div>
            <hr class="roundedExtended"><hr class="rounded">

            <!--            Tire pressure-->

            <h1>Tire pressure</h1>
            <div></div>
            <div>
                <h4>Delete pressure</h4>
                <table>
                    <thead>
                    <tr>
                        <td rowspan='2'></td>
                        <td rowspan='2'>id</td>
                        <td rowspan='2'>Tires</td>
                        <td colspan='2'>Front</td>
                        <td colspan='2'>Rear</td>
                    </tr>
                    <tr>
                        <td class='min'>Min psi</td>
                        <td class='max'>Max psi</td>
                        <td class='min'>Min psi</td>
                        <td class='max'>Max psi</td>
                    </tr>
                    </thead>
                    <tbody id="pressureBody"></tbody>
                </table>
            </div>
            <div>
                <h4>Add pressure</h4>
                <div><input type='text' name='class' placeholder='Class name' id="addPressureClassTextField"></div>
                <div><input type='text' name='fmi' placeholder='Front min' id="addPressureFmiTextField"></div>
                <div><input type='text' name='fma' placeholder='Front max' id="addPressureFmaTextField"></div>
                <div><input type='text' name='rmi' placeholder='Rear min' id="addPressureRmiTextField"></div>
                <div><input type='text' name='rma' placeholder='Rear max' id="addPressureRmaTextField"></div>
            </div>
            <div><input type='button' value='Delete pressure' class="inputButton submit"></div>
            <div><input type='button' value='Add pressure' class="inputButton submit" id="addPressureButton"></div>
            <div>
                <h4>Update pressure</h4>
                <select name='updateTire' id="pressurePicker"></select>
                <div><input type='text' name='class' placeholder='Class name'></div>
                <div><input type='text' name='fmi' placeholder='Front min'></div>
                <div><input type='text' name='fma' placeholder='Front max'></div>
                <div><input type='text' name='rmi' placeholder='Rear min'></div>
                <div><input type='text' name='rma' placeholder='Rear max'></div>
            </div>
            <div></div>
            <div><input type='button' value='Update pressure' class="inputButton submit"></div>
            <div></div>
            <hr class="roundedExtended"><hr class="rounded">

            <!--            Admins-->

            <h1>Admins</h1>
            <div></div>
            <div>
                <h4>Add admin</h4>
                <div><input type='text' name='login' placeholder='login' id="addAdminLoginTextField"></div>
                <div><input type='text' name='password' placeholder='password' id="addAdminPasswordTextField"></div>
            </div>
            <div>
                <div>
                    <h4>Remove admin</h4>
                    <select name='admin' id="admins"></select>
                </div>
            </div>
            <div><input type='button' value='Add admin' class="inputButton submit" id="addAdminButton"></div>
            <div><input type='button' value='Remove admin' class="inputButton submit"></div>
        </div>
    </div>

    <form id='login'>
        <div><input type='text' name='lgn' placeholder='login'></div>
        <div><input type='password' name='pswd' placeholder='password'></div>
        <input type='button' class='submit' value="Sign In" id="signIn">
    </form>
</div>
</body>
</html>
