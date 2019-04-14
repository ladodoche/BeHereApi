define({ "api": [
  {
    "type": "post",
    "url": "authentificate/",
    "title": "user authentificate",
    "group": "Authentificate",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User password</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"email\": \"dogui78930@gmail.com\",\n  \"password\": \"ESGI-tir1997\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "   HTTP/1.1 201 Created\n{\n   \"error\": false,\n   \"user\": {\n       \"id\": 1,\n       \"email\": \"d.alayrangues@gmail.com\",\n       \"name\": \"dorian\",\n       \"surname\": \"alayrangues\",\n       \"birthDate\": \"1997-05-22T00:00:00.000Z\",\n       \"pathPicture\": null,\n       \"admin\": false,\n       \"created_at\": \"2019-04-14T09:20:46.000Z\",\n       \"updated_at\": \"2019-04-14T09:20:46.000Z\",\n       \"deleted_at\": null,\n       \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiYWRtaW4iOmZhbHNlLCJpYXQiOjE1NTUyMzQyMTgsImV4cCI6MTU1NTI3MDIxOH0.25NU-sPEtY7Rd-PuVL5EZkESn5Tz_t1H3aL7IVNbuzo\"\n   }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"error\": true\n    \"message\": \"L'email n'existe pas ou l'email et le mot de passe ne correspondent pas\"\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true\n    \"message\": \"Erreur lors de la récupération de l'utilisateur\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/authentificate.js",
    "groupTitle": "Authentificate",
    "name": "PostAuthentificate"
  },
  {
    "type": "post",
    "url": "users/create",
    "title": "add a new user",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>User name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "surname",
            "description": "<p>User surname</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "checkPassword",
            "description": "<p>User checkPassword</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "birthDate",
            "description": "<p>User birthDate</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "pathPicture",
            "description": "<p>User pathPicture</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"email\": \"dogui78930@gmail.com\",\n  \"name\": \"dorian\",\n  \"surname\": \"alayrangues\",\n  \"password\": \"ESGI-tir1997\",\n  \"checkPassword\": \"ESGI-tir1997\",\n  \"birthDate\": \"1997-05-22\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 201 Created\n{\n    \"error\": false,\n    \"user\": {\n        \"admin\": false,\n        \"id\": 1,\n        \"email\": \"d.alayrangues@gmail.com\",\n        \"name\": \"dorian\",\n        \"surname\": \"alayrangues\",\n        \"birthDate\": \"1997-05-22T00:00:00.000Z\",\n        \"updated_at\": \"2019-04-14T09:20:46.668Z\",\n        \"created_at\": \"2019-04-14T09:20:46.668Z\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true\n    \"message\": \"Erreur lors de la création de l'utilisateur\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/user.js",
    "groupTitle": "Users",
    "name": "PostUsersCreate"
  }
] });
