1. Create a new savings circle
   Description: Creates a new savings circle with the authenticated user as the first member and admin.

Endpoint: POST /circles

Authentication: Required. Provide JWT in Authorization: Bearer <token> header.

Request Body: CreateCircleDto

json
Show full code block
{
"name": "My First Circle",
"description": "A weekly savings group for friends.",
"contributionAmount": 50,
"frequency": "weekly", // e.g., 'weekly', 'bi-weekly', 'monthly'
"maxMembers": 10,
"isPublic": false
}
Successful Response (201 Created): Returns the full object of the newly created circle.

json
Show full code block
{
"id": "c1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6",
"name": "My First Circle",
"description": "A weekly savings group for friends.",
"contributionAmount": 50,
"frequency": "weekly",
"maxMembers": 10,
"isPublic": false,
"status": "pending", // e.g., 'pending', 'active', 'completed'
"inviteCode": "ABC-123",
"creatorId": "user-id-from-jwt",
"createdAt": "2023-10-27T10:00:00.000Z"
} 2. Join a circle
Description: Allows an authenticated user to join an existing circle using its invite code.

Endpoint: POST /circles/join

Authentication: Required.

Request Body: JoinCircleDto

json
{
"inviteCode": "ABC-123"
}
Successful Response (201 Created): Returns the circle object that the user successfully joined.

3. Get user's circles
   Description: Retrieves a list of all circles the authenticated user is a member of.

Endpoint: GET /circles/my-circles

Authentication: Required.

Successful Response (200 OK): Returns an array of circle objects.

json
Show full code block
[
{
"id": "c1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6",
"name": "My First Circle",
"status": "pending",
"memberCount": 5,
"maxMembers": 10
},
{
"id": "z9y8x7w6-v5u4-t3s2-r1q0-p9o8n7m6l5k4",
"name": "Monthly Savers",
"status": "active",
"memberCount": 12,
"maxMembers": 12
}
] 4. Preview circle via invite code
Description: A public endpoint to get a preview of a circle's details before joining. It shows non-sensitive information.

Endpoint: GET /circles/invite/:code

Authentication: Not Required.

URL Parameters:

code (string): The invite code of the circle.
Successful Response (200 OK): Returns a public-facing preview of the circle.

json
Show full code block
{
"name": "My First Circle",
"description": "A weekly savings group for friends.",
"contributionAmount": 50,
"frequency": "weekly",
"memberCount": 5,
"maxMembers": 10
} 5. Get full circle details
Description: Fetches the complete details for a specific circle. The backend should verify that the authenticated user is a member of this circle.
Endpoint: GET /circles/:id
Authentication: Required.
URL Parameters:
id (string): The unique ID of the circle.
Successful Response (200 OK): Returns the full circle object. 6. Get circle members
Description: Retrieves a list of all members in a specific circle. The user must be a member of the circle to access this.

Endpoint: GET /circles/:id/members

Authentication: Required.

URL Parameters:

id (string): The unique ID of the circle.
Successful Response (200 OK): Returns an array of member objects.

json
Show full code block
[
{
"id": "user-id-1",
"name": "Alice",
"avatarUrl": "https://example.com/avatar1.png"
},
{
"id": "user-id-2",
"name": "Bob",
"avatarUrl": "https://example.com/avatar2.png"
}
] 7. Get circle payout timeline
Description: Gets the payout schedule for an active circle, showing which member gets paid in which turn.

Endpoint: GET /circles/:id/timeline

Authentication: Required.

URL Parameters:

id (string): The unique ID of the circle.
Successful Response (200 OK): Returns an array representing the timeline.

json
Show full code block
[
{
"turn": 1,
"payoutDate": "2023-11-03T10:00:00.000Z",
"memberId": "user-id-2",
"memberName": "Bob",
"status": "completed"
},
{
"turn": 2,
"payoutDate": "2023-11-10T10:00:00.000Z",
"memberId": "user-id-1",
"memberName": "Alice",
"status": "upcoming"
}
] 8. Start a circle's cycle
Description: Activates a pending circle. This action is typically restricted to the circle's creator/admin. It locks the member list and generates the payout timeline (lottery).
Endpoint: POST /circles/:id/start
Authentication: Required.
URL Parameters:
id (string): The unique ID of the circle.
Successful Response (200 OK): Returns the updated circle object with status active and a generated timeline. 9. Create an exit request
Description: Allows a member to submit a formal request to leave the circle. This typically initiates a voting process among other members.

Endpoint: POST /circles/:id/exit-request

Authentication: Required.

URL Parameters:

id (string): The unique ID of the circle.
Request Body: CreateExitRequestDto

json
{
"reason": "I have an unexpected financial emergency."
}
Successful Response (201 Created): Returns the newly created exit request object.

json
Show full code block
{
"id": "exit-req-123",
"circleId": "c1a2b3c4-...",
"requestingUserId": "user-id-from-jwt",
"reason": "I have an unexpected financial emergency.",
"status": "pending_vote",
"createdAt": "2023-10-27T12:00:00.000Z"
} 10. Vote on an exit request
Description: Allows other circle members to vote (approve/deny) an open exit request.

Endpoint: POST /circles/:id/vote

Authentication: Required.

URL Parameters:

id (string): The unique ID of the circle.
Request Body: VoteExitRequestDto

json
{
"exitRequestId": "exit-req-123",
"approve": true
}
Successful Response (200 OK): Returns the updated exit request object, reflecting the new vote count and potentially an updated status (approved or rejected) if the vote concludes the process.
