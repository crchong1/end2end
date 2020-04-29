API Layer

USER
/register-user
/check-username
/sign-in
/log-out
/get-all-users

CHAT
/create-chat
/create-group-chat
/get-messages


SIGNAL Protocol
On creation of chat:
Create a long-term identity key pair
Create a medium-term signed prekey pair
Create several ephermeral prekey pairs
Store in client cookie

Step 1) 
Start a session
2 users: Alice and Bob
Alice requests Bob's public key bundle
User her own identity and medium-term private keys to create a master secret
Alice sends secret to Bob so that he can decipher and validate