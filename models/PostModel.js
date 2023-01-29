const db=require('../Config/db');

//this are custome promise functions created by me.. we now consume this promise uing 
//async/await syntax
class Post {
  constructor(title, body) {
    this.title = title;
    this.body = body;
  }
  Save() {
    let d = new Date();
    let yr = d.getFullYear();
    let mm = d.getMonth() + 1; //month in javascript start from o index
    let dd = d.getDate(); // this return number of day in the month
    let createdAtDate = `${yr}-${mm}-${dd}`;
    let sql = `
          INSERT INTO feedpost(
            title,
            body,
            created_at
            )
            VALUES(
              '${this.title}',
              '${this.body}',
              '${createdAtDate}'

            ) `;

    return db.execute(sql);

     
  }
  static FindAll() {
    let sql = "SELECT * FROM feedpost;";
    return db.execute(sql);
  }

  static FindById(id) {
    let sql = `SELECT * FROM feedpost WHERE id='${id}';`;
    return db.execute(sql);
  }
}

module.exports=Post;