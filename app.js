const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/guestlistDB", {useNewUrlParser: true});

const guestsSchema = new Schema({
  name: String
});

const Guest = mongoose.model("Guest", guestsSchema);

const guest1 = new Guest({
  name: "Hayley Fake"
});

const guest2 = new Guest({
  name: "Clay Kuersteiner"
});

const defaultGuests = [guest1, guest2];

Guest.insertMany(defaultGuests)
  .then(function () {
        console.log("Successfully saved default guests to DB");
    })
  .catch(function (err) {
        console.log(err);
  });

app.get("/", function(req, res) {


  Guest.find({}).then(function(foundGuests){
    if (foundGuests.length === 0) {
      Guest.insertMany(defaultGuests)
      .then(function () {
        console.log("Successfully saved default guests to DB");
    })
      .catch(function (err) {
        console.log(err);
    });
    res.redirect("/)");
    } else {
      res.render("list", { listTitle: "Please RSVP by adding your name to the list:", newListItems: foundGuests });
    }
    
  });

});

app.post("/", function(req, res){

  const guestName = req.body.newGuest;
  const guest = new Guest ({
    name: guestName
  });
  guest.save();
  res.redirect("/");
});

app.post("/delete", function(req, res){
  const checkedGuestId = req.body.checkbox;

  Guest.findByIdAndRemove(checkedGuestId).then(function(del){
    if (del) {
      console.log("Successfully deleted the checked guest.");
      res.redirect("/");
    }
  })
  .catch(function(err){
    console.log(err);
  })
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
