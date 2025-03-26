import mysql from "mysql2";

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "dr_app",
  password: "MATpoochh1.",
});

function connection(err) {
  if (err) {
    console.log("Error in Connection");
  } else {
    console.log("Connected");
  }
}
con.connect(connection());

export default con;
