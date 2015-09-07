# Database structure

### login details
Command: **hgetall**  
Key: **login**  
Contains: **hash** key = username, value = hashed   password

### teacher:
Command: **hgetall**  
Key: **teacher**  
Contains: **hash**: key = userID, value = stringified JSON obj with all the user's info

JSON contains:
+ firstname
+ surname
+ username
+ isAdmin
+ isTeacher

### set of classes:
Command: **smembers**  
Key: **[teacherID]:class**  
Contains: list of all the classnames for a particular teacher

### class:
Command: **hgetall**  
Key: **[teacherID]:[className]:pupil**  
Contains: key = pupil's  userID, value = stringified JSON object of user's info

### pupil:
Command: **hgetall**  
Key: **[teacherID]:[pupilID]**
Contains: pupil's information
+ firstname
+ surname
+ username
+ isAdmin (false)
+ isTeacher (false)

### generated ID numbers
Command: **smembers**  
Key: **allUserIDs**  
Contains: a list of all ID numbers generated (to prevent duplicates)

### assignments:
Command: **hgetall**  
Key: **[teacherID]:[classID]:assignment**  
Contains: key = assignmentID, value = stringified JSON of assignment info  

JSON contains:
+ timestamp
+ assignmentID
+ text
+ question
+ category

### list of replies for a give assignment
Key: **[teacherID]:[classID]:[assignmentID]:reply**  
Contains: sorted set of replies:

### reply
Command: **hgetall**
Key: **[teacherID]:[classID]:[assignmentID]:[responseID]**
Contains: all the information relating to the response
+ **key** (repsonseID)
+ **time** (timestamp)
+ **teacher** (id of user's teacher)
+ **name**  (full name of user)
+ **userID**
+ **threeWords**
+ **response**
