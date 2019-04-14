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
    "type": "delete",
    "url": "bars/delete/:bar_id",
    "title": "delete bar",
    "group": "Bars",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 Success\n{\n    \"error\": false\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"Le bar n'existe pas\"\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération du bar\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/bar.js",
    "groupTitle": "Bars",
    "name": "DeleteBarsDeleteBar_id"
  },
  {
    "type": "get",
    "url": "bars/:bar_id",
    "title": "get bar",
    "group": "Bars",
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "{\n   \"error\": false,\n   \"message\": {\n       \"id\": 1,\n       \"name\": \"Le dernier bar avant la fin du monde\",\n       \"gpsLatitude\": 48,\n       \"gpsLongitude\": 2.3461672,\n       \"description\": \"Coucou\",\n       \"webSiteLink\": \"https://www.facebook.com/?ref=tn_tnmn\",\n       \"created_at\": \"2019-04-14T13:42:47.000Z\",\n       \"updated_at\": \"2019-04-14T13:42:47.000Z\",\n       \"deleted_at\": null,\n       \"user_id\": 1\n   }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"Le bar n'existe pas\"\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération du bar\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/bar.js",
    "groupTitle": "Bars",
    "name": "GetBarsBar_id"
  },
  {
    "type": "get",
    "url": "bars/?name=name&user_id=user_id",
    "title": "get all bars",
    "group": "Bars",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "user_id",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "   HTTP/1.1 201 Created\n{\n   \"error\": false,\n   \"message\": [\n       {\n           \"id\": 1,\n           \"name\": \"Le dernier bar avant la fin du monde\",\n           \"gpsLatitude\": 48,\n           \"gpsLongitude\": 2.3461672,\n           \"description\": \"Coucou\",\n           \"webSiteLink\": \"https://www.facebook.com/?ref=tn_tnmn\",\n           \"created_at\": \"2019-04-14T13:42:47.000Z\",\n           \"updated_at\": \"2019-04-14T13:42:47.000Z\",\n           \"deleted_at\": null,\n           \"user_id\": 1\n       }\n   ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"Aucun bar trouvé\"\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération des bars\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/bar.js",
    "groupTitle": "Bars",
    "name": "GetBarsNameNameUser_idUser_id"
  },
  {
    "type": "post",
    "url": "bars/create",
    "title": "add a new bar",
    "group": "Bars",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": ""
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>obligatoire, unique et entre 2 à 200 caractères</p>"
          },
          {
            "group": "Parameter",
            "type": "Double",
            "optional": false,
            "field": "gpsLatitude",
            "description": "<p>obligatoire</p>"
          },
          {
            "group": "Parameter",
            "type": "Double",
            "optional": false,
            "field": "gpsLongitude",
            "description": "<p>obligatoire</p>"
          },
          {
            "group": "Parameter",
            "type": "Text",
            "optional": false,
            "field": "description",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "webSiteLink",
            "description": "<p>format url</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"name\": \"Le dernier bar avant la fin du monde\",\n  \"gpsLatitude\": \"48.\",\n  \"gpsLongitude\": \"2.3461672\",\n  \"description\": \"Coucou\",\n  \"webSiteLink\": \"https://www.facebook.com/?ref=tn_tnmn\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 201 Created\n{\n    \"error\": false\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la création de votre bar\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/bar.js",
    "groupTitle": "Bars",
    "name": "PostBarsCreate"
  },
  {
    "type": "put",
    "url": "bars/update/:bar_id",
    "title": "update bar",
    "group": "Bars",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": ""
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>unique et entre 2 à 200 caractères</p>"
          },
          {
            "group": "Parameter",
            "type": "Double",
            "optional": false,
            "field": "gpsLatitude",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Double",
            "optional": false,
            "field": "gpsLongitude",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Text",
            "optional": false,
            "field": "description",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "webSiteLink",
            "description": "<p>format url</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"name\": \"Le dernier bar avant la fin du monde\",\n  \"gpsLatitude\": \"48.\",\n  \"gpsLongitude\": \"2.3461672\",\n  \"description\": \"Coucou\",\n  \"webSiteLink\": \"https://www.facebook.com/?ref=tn_tnmn\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 201 Created\n{\n    \"error\": false\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": message\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/bar.js",
    "groupTitle": "Bars",
    "name": "PutBarsUpdateBar_id"
  },
  {
    "type": "delete",
    "url": "users/delete/:user_id",
    "title": "delete user",
    "group": "Users",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 Success\n{\n    \"error\": false\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"L'utilisateur n'existe pas\"\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération de l'utilisateurs\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/user.js",
    "groupTitle": "Users",
    "name": "DeleteUsersDeleteUser_id"
  },
  {
    "type": "get",
    "url": "users/download/:user_id",
    "title": "download picture user",
    "group": "Users",
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 Success\n{\n    \"error\": false,\n    \"buffer\": buffer\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": message\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/user.js",
    "groupTitle": "Users",
    "name": "GetUsersDownloadUser_id"
  },
  {
    "type": "get",
    "url": "users/?email=email",
    "title": "get all users",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 Success\n{\n    \"error\": false,\n    \"message\": [\n          {\n              \"id\": 1,\n              \"email\": \"d.alayrangues@gmail.com\",\n              \"name\": \"dorian\",\n              \"surname\": \"alayrangues\",\n              \"birthDate\": \"1997-05-22T00:00:00.000Z\",\n              \"pathPicture\": null,\n              \"admin\": false,\n              \"created_at\": \"2019-04-14T09:20:46.000Z\",\n              \"updated_at\": \"2019-04-14T09:20:46.000Z\",\n              \"deleted_at\": null\n          }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"Aucun utilisateur trouvé\"\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération des utilisateurs\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/user.js",
    "groupTitle": "Users",
    "name": "GetUsersEmailEmail"
  },
  {
    "type": "get",
    "url": "users/:user_id",
    "title": "get user",
    "group": "Users",
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 Success\n{\n    \"error\": false,\n    \"user\": {\n        \"admin\": false,\n        \"id\": 1,\n        \"email\": \"dogui78930@gmail.com\",\n        \"name\": \"dorian\",\n        \"surname\": \"alayrangues\",\n        \"birthDate\": \"1997-05-22T00:00:00.000Z\",\n        \"updated_at\": \"2019-04-14T09:20:46.668Z\",\n        \"created_at\": \"2019-04-14T09:20:46.668Z\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"L'utilisateur n'existe pas\"\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération de l'utilisateurs\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/user.js",
    "groupTitle": "Users",
    "name": "GetUsersUser_id"
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
            "description": "<p>obligatoire, unique et avec le bon format</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>obligatoire et entre 2 à 200 caractères</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "surname",
            "description": "<p>obligatoire et entre 2 à 200 caractères</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>obligatoire, entre 8 et 40 caractères, avec au moins une lettre majuscule, majuscule et un chiffre</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "checkPassword",
            "description": "<p>obligatoire et doit être égale au mot de passe</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "birthDate",
            "description": "<p>obligatoire et doit être majeur</p>"
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
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la création de l'utilisateur\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/user.js",
    "groupTitle": "Users",
    "name": "PostUsersCreate"
  },
  {
    "type": "put",
    "url": "users/update/password/:user_id",
    "title": "update password user",
    "group": "Users",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": ""
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "oldPassword",
            "description": "<p>égale au mot de passe de l'utilisateur</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "newPasswordentre",
            "description": "<p>8 et 40 caractères, avec au moins une lettre majuscule, majuscule et un chiffre</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "checkNewPassword",
            "description": "<p>doit être égale au mot de passe</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"oldPassword\": \"ESGI-tir19970522\",\n  \"newPassword\": \"ESGI-tir19970522\",\n  \"checkNewPassword\": \"ESGI-tir19970522\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 201 Created\n{\n    \"error\": false\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": message\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/user.js",
    "groupTitle": "Users",
    "name": "PutUsersUpdatePasswordUser_id"
  },
  {
    "type": "put",
    "url": "users/update/:user_id",
    "title": "update user",
    "group": "Users",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": ""
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>unique et avec le bon format</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>entre 2 à 200 caractères</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "surname",
            "description": "<p>et entre 2 à 200 caractères</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "birthDate",
            "description": "<p>et doit être majeur</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"email\": \"dogui78930@gmail.com\",\n  \"name\": \"dorian\",\n  \"surname\": \"alayrangues\",\n  \"birthDate\": \"1997-05-22\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 201 Created\n{\n    \"error\": false,\n    \"user\": {\n        \"admin\": false,\n        \"id\": 1,\n        \"email\": \"d.alayrangues@gmail.com\",\n        \"name\": \"dorian\",\n        \"surname\": \"alayrangues\",\n        \"birthDate\": \"1997-05-22T00:00:00.000Z\",\n        \"pathPicture\": null,\n        \"updated_at\": \"2019-04-14T09:21:46.668Z\",\n        \"created_at\": \"2019-04-14T09:20:46.668Z\"\n        \"deleted_at\": null\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": message\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/user.js",
    "groupTitle": "Users",
    "name": "PutUsersUpdateUser_id"
  },
  {
    "type": "put",
    "url": "users/upload/:user_id",
    "title": "upload picture user",
    "group": "Users",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": ""
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "file",
            "description": "<p>Obligatoire, format png ou jpg</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 201 Created\n{\n    \"error\": false\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": message\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/user.js",
    "groupTitle": "Users",
    "name": "PutUsersUploadUser_id"
  }
] });
