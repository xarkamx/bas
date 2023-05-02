## Basic Access Service

* [ ] add change password endpoint
* [ ] Add company token to create users endpoint



Workflow should be 

1. [ ] Master user can create generic users
2. [ ] Master User can create roles
3. [ ] Master user can create companies
4. [ ] When a company is created it will generate admin roles and system roles
5. [ ] A system role doesnt expire
6. [ ] A system role can regenerate his JWT
7. [ ] A global list of users is accesible to master user
8. [ ] Power users can add users to company
9. [ ] a power user for the company has access to a list of users
1. [ ] when creating a new user, you have an optional field that allows you the assign a user to a company by default
1. [ ] when logged you will get the roles for the user filtered by he requesting company
