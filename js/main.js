firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
	// User is signed in.
	
    $("#loginDialog").hide();
    $("#signupDialog").hide();
    $('.login-splash').hide();

    var user = firebase.auth().currentUser;

    var name, email, photoUrl, uid, emailVerified;

	if (user != null) {
	  name = user.displayName;
	  email = user.email;
	  photoUrl = user.photoURL;
	  emailVerified = user.emailVerified;
	  uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
	                   // this value to authenticate with your backend server, if
					   // you have one. Use User.getToken() instead.

	}

	$("#user-info-right").text(`Welcome, ${email}`);


  } else {
	// No user is signed in.
	$("#signupDialog").hide();
	$("#loginDialog").show();

  }
});

/* LOGIN PROCESS */

$("#loginBtn").click(
	function(){

		var email = $("#loginEmail").val();
		var password = $("#loginPassword").val();

		if(email != "" && password != "") {
			$("#loginProgress").show();
			$("#loginBtn").hide();

			firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error){
				$("#loginError").show().text(error.message);
				$("#loginProgress").hide();
				$("#loginBtn").show();				
			});
		}
	}
);

/* LOGOUT PROCESS */

$("#logoutBtn").click(
	function(){
		firebase.auth().signOut().then(function() {
		  // Sign-out successful.

	  		$(".login-splash").show();
			$("#loginProgress").hide();
			$("#loginBtn").show();	

		}).catch(function(error) {
		  // An error happened.


		});
	}
);

/* SIGNUP PROCESS */

$("#showSignupBtn").click(
	function(){
		var loginDialog = document.querySelector('#loginDialog');
		var signupDialog = document.querySelector('#signupDialog');
		$("#loginDialog").hide();
		$("#signupDialog").show();

});

$("#signupBtn").click(
	function(){

		var email = $("#signupEmail").val();
		var password = $("#signupPassword").val();
		var confirmPassword = $("#confirmPassword").val();

		if(email != "" && password != "" && confirmPassword != "" && password == confirmPassword) {
			firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				$("#signupError").show().text(error.message);
				$("#loginProgress").hide();
				$("#signupBtn").show();		
			// ...
			});
		} 
		$("#signupEmail").val("");
		$("#signupPassword").val("");
		$("#confirmPassword").val("");

});

$("#backtoSigninBtn").click(
	function(){
		$("#signupDialog").hide();
		$("#loginDialog").show();
	}
)

// DATABASE CONNECTION

// Get a reference to the database service
var paidUserRow = document.getElementById("paidUserRow");

var firebaseDB = firebase.database().ref();

let firstKey;
let tableHeader = "";

// ACCESSING DATABASE AND POPULATING HEADERS

let allMonths = ['January','February','March', 'April','May','June','July','August','September','October','November','December'];

let monthsArray = [];

firebaseDB.on('value', function(snapshot){
	let asnapshot = snapshot.val();

	$.each(asnapshot, function(key, value) {
		tableHeader += `<th>${allMonths[key]}</th>`;
	})

	$("thead tr").append(tableHeader);
})

// POPULATING ROWS

let summary = "";
let currentMonth = "";
let monthlyUsers = [];
let tableRow = "";
let d = new Date();
let n = d.getMonth();

firebaseDB.on('value', function(snapshot){
	let asnapshot = snapshot.val();

	let usersData = `<td>Paid users</td>`;
	let priceData = `<td>Monthly price</td>`;
	let mrrData = `<td>MRR ($)</td>`;
	let costData = `<td>Costs</td>`;
	
	 $.each(asnapshot, function(key, value) {
		 usersData += `<td>${value.users}</td>`;
		 monthlyUsers.push(value.users);
		 if (key === n) {
			 let usersWeekly = Math.ceil(value.users/4.4);
			 $(`#summary`).text(usersWeekly);
			 $(`#currentMonth`).text(allMonths[key]);
		 }
		})
	  
	 $.each(asnapshot, function(key, value) {
		 priceData += `<td>$${value.price}</td>`;
		 mrrData += `<td>$${value.users*value.price}</td>`;
		})
	 
	  $.each(asnapshot, function(key, value) {
		  costData += `<td>$${value.cost}</td>`;
		})
	 
	 $(`#users`).append(usersData);
	 $(`#price`).append(priceData);
	 $(`#mrr`).append(mrrData);
	 $(`#cost`).append(costData);

	// CHARTS

	var ctx = document.getElementById("myChart");
	var myChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: allMonths,
			datasets: [{
				data: monthlyUsers,
				lineTension: 0,
				backgroundColor: 'transparent',
				borderColor: '#007bff',
				borderWidth: 4,
				pointBackgroundColor: '#007bff'
			}]
		},
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true,
					}
				}]
			},
			legend: {
				display: false,
			}
		}
	});

})

// UPDATE NUMBERS

$("#updateNumbersBtn").click(
	function(){
		let plan = $("#updatePlan").val();
		console.log(firebase.database());
		console.log(plan)
});