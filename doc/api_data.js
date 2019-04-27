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
          "content": "   HTTP/1.1 200 Success\n{\n   \"error\": false,\n   \"message\": {\n       \"id\": 1,\n       \"name\": \"Le dernier bar avant la fin du monde\",\n       \"gpsLatitude\": 48,\n       \"gpsLongitude\": 2.3461672,\n       \"description\": \"Coucou\",\n       \"webSiteLink\": \"https://www.facebook.com/?ref=tn_tnmn\",\n       \"created_at\": \"2019-04-14T13:42:47.000Z\",\n       \"updated_at\": \"2019-04-14T13:42:47.000Z\",\n       \"deleted_at\": null,\n       \"user_id\": 1\n   }\n}",
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
          "content": "   HTTP/1.1 200 Success\n{\n   \"error\": false,\n   \"message\": [\n       {\n           \"id\": 1,\n           \"name\": \"Le dernier bar avant la fin du monde\",\n           \"gpsLatitude\": 48,\n           \"gpsLongitude\": 2.3461672,\n           \"description\": \"Coucou\",\n           \"webSiteLink\": \"https://www.facebook.com/?ref=tn_tnmn\",\n           \"created_at\": \"2019-04-14T13:42:47.000Z\",\n           \"updated_at\": \"2019-04-14T13:42:47.000Z\",\n           \"deleted_at\": null,\n           \"user_id\": 1\n       }\n   ]\n}",
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
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "earlyHappyHours",
            "description": "<p>format heure obligatoire</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lateHappyHours",
            "description": "<p>format heure obligatoire</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "facebokLink",
            "description": "<p>format url</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "twitterLink",
            "description": "<p>format url</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "instagramLink",
            "description": "<p>format url</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"name\": \"Le dernier bar avant la fin du monde\",\n  \"gpsLatitude\": \"48.\",\n  \"gpsLongitude\": \"2.3461672\",\n  \"description\": \"Coucou\",\n  \"earlyHappyHours\": \"19:00\",\n  \"lateHappyHours\": \"21:00\",\n  \"webSiteLink\": \"https://www.facebook.com/?ref=tn_tnmn\",\n  \"facebokLink\": \"https://www.facebook.com/?ref=tn_tnmn\",\n  \"twitterLink\": \"https://www.facebook.com/?ref=tn_tnmn\",\n  \"instagramLink\": \"https://www.facebook.com/?ref=tn_tnmn\"\n}",
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
            "field": "earlyHappyHours",
            "description": "<p>format url</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lateHappyHours",
            "description": "<p>format url</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "webSiteLink",
            "description": "<p>format url</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "facebokLink",
            "description": "<p>format url</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "twitterLink",
            "description": "<p>format url</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "instagramLink",
            "description": "<p>format url</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"name\": \"Le dernier bar avant la fin du monde\",\n  \"gpsLatitude\": \"48.\",\n  \"gpsLongitude\": \"2.3461672\",\n  \"description\": \"Coucou\",\n  \"webSiteLink\": \"https://www.facebook.com/?ref=tn_tnmn\",\n  \"facebokLink\": \"https://www.facebook.com/?ref=tn_tnmn\",\n  \"twitterLink\": \"https://www.facebook.com/?ref=tn_tnmn\",\n  \"instagramLink\": \"https://www.facebook.com/?ref=tn_tnmn\",\n  \"earlyHappyHours\": \"19:00\",\n  \"lateHappyHours\": \"21:00\"\n}",
          "type": "json"
        }
      ]
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
    "url": "beers/delete/:beer_id",
    "title": "delete beer",
    "group": "Beers",
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
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"La bière n'existe pas\"\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération de la bière\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/beer.js",
    "groupTitle": "Beers",
    "name": "DeleteBeersDeleteBeer_id"
  },
  {
    "type": "get",
    "url": "beers/:beer_id",
    "title": "get beer",
    "group": "Beers",
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 Success\n{\n    \"error\": false,\n    \"beer\": {\n        \"id\": 1,\n        \"name\": \"Leffe\",\n        \"color\": \"blanche\",\n        \"origin\": \"Belgique\",\n        \"description\": \"La Leffe ou Abbaye de Leffe est une bière belge d'Abbaye reconnue, créée en 1240 par les chanoines de l'ordre de Prémontré de l'abbaye Notre-Dame de Leffe et produite par la brasserie Artois à Louvain.\",\n        \"pathPicture\": null,\n        \"updated_at\": \"2019-04-14T09:20:46.668Z\",\n        \"created_at\": \"2019-04-14T09:20:46.668Z\",\n        \"typeOfBeer\": [\n                    {\n                        \"id\": 2,\n                        \"name\": \"Brune\",\n                        \"created_at\": \"2019-04-20T09:42:06.000Z\",\n                        \"updated_at\": \"2019-04-20T09:42:06.000Z\",\n                        \"deleted_at\": null,\n                        \"beer_typeOfBeer\": {\n                            \"created_at\": \"2019-04-20T09:44:59.000Z\",\n                            \"updated_at\": \"2019-04-20T09:44:59.000Z\",\n                            \"beer_id\": 1,\n                            \"type_of_beer_id\": 2\n                        }\n                    },\n                    {\n                        \"id\": 3,\n                        \"name\": \"Blanche\",\n                        \"created_at\": \"2019-04-20T09:42:12.000Z\",\n                        \"updated_at\": \"2019-04-20T09:42:12.000Z\",\n                        \"deleted_at\": null,\n                        \"beer_typeOfBeer\": {\n                            \"created_at\": \"2019-04-20T09:45:01.000Z\",\n                            \"updated_at\": \"2019-04-20T09:45:01.000Z\",\n                            \"beer_id\": 1,\n                            \"type_of_beer_id\": 3\n                        }\n                    }\n                ]\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"La bière n'existe pas\"\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération de la bières\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/beer.js",
    "groupTitle": "Beers",
    "name": "GetBeersBeer_id"
  },
  {
    "type": "get",
    "url": "beers/download/:beer_id",
    "title": "download picture beer",
    "group": "Beers",
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
    "filename": "configs/Routes/beer.js",
    "groupTitle": "Beers",
    "name": "GetBeersDownloadBeer_id"
  },
  {
    "type": "get",
    "url": "beers/?email=email&color=color&origin=origin",
    "title": "get all beers",
    "group": "Beers",
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
            "field": "color",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "origin",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 Success\n{\n    \"error\": false,\n    \"message\": [\n          {\n              \"id\": 1,\n              \"name\": \"Leffe\",\n              \"color\": \"blonde\",\n              \"origin\": \"Belgique\",\n              \"description\": \"La Leffe ou Abbaye de Leffe est une bière belge d'Abbaye reconnue, créée en 1240 par les chanoines de l'ordre de Prémontré de l'abbaye Notre-Dame de Leffe et produite par la brasserie Artois à Louvain.\",\n              \"pathPicture\": null,\n              \"created_at\": \"2019-04-14T09:20:46.000Z\",\n              \"updated_at\": \"2019-04-14T09:20:46.000Z\",\n              \"deleted_at\": null,\n              \"typeOfBeer\": [\n                    {\n                        \"id\": 2,\n                        \"name\": \"Brune\",\n                        \"created_at\": \"2019-04-20T09:42:06.000Z\",\n                        \"updated_at\": \"2019-04-20T09:42:06.000Z\",\n                        \"deleted_at\": null,\n                        \"beer_typeOfBeer\": {\n                            \"created_at\": \"2019-04-20T09:44:59.000Z\",\n                            \"updated_at\": \"2019-04-20T09:44:59.000Z\",\n                            \"beer_id\": 1,\n                            \"type_of_beer_id\": 2\n                        }\n                    },\n                    {\n                        \"id\": 3,\n                        \"name\": \"Blanche\",\n                        \"created_at\": \"2019-04-20T09:42:12.000Z\",\n                        \"updated_at\": \"2019-04-20T09:42:12.000Z\",\n                        \"deleted_at\": null,\n                        \"beer_typeOfBeer\": {\n                            \"created_at\": \"2019-04-20T09:45:01.000Z\",\n                            \"updated_at\": \"2019-04-20T09:45:01.000Z\",\n                            \"beer_id\": 1,\n                            \"type_of_beer_id\": 3\n                        }\n                    }\n                ]\n          }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"Aucune bière trouvé\"\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération des bières\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/beer.js",
    "groupTitle": "Beers",
    "name": "GetBeersEmailEmailColorColorOriginOrigin"
  },
  {
    "type": "post",
    "url": "beers/create",
    "title": "add a new beer",
    "group": "Beers",
    "parameter": {
      "fields": {
        "Parameter": [
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
            "field": "color",
            "description": "<p>obligatoire et entre 2 à 100 caractères</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "origin",
            "description": "<p>obligatoire, entre 2 et 150 caractères, avec au moins une lettre majuscule, majuscule et un chiffre</p>"
          },
          {
            "group": "Parameter",
            "type": "Text",
            "optional": false,
            "field": "description",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"name\": \"Leffe\",\n  \"color\": \"blonde\",\n  \"origin\": \"Belgique\",\n  \"description\": \"La Leffe ou Abbaye de Leffe est une bière belge d'Abbaye reconnue, créée en 1240 par les chanoines de l'ordre de Prémontré de l'abbaye Notre-Dame de Leffe et produite par la brasserie Artois à Louvain.\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 201 Created\n{\n    \"error\": false,\n    \"beer\": {\n        \"name\": \"Leffe\",\n        \"color\": \"blonde\",\n        \"origin\": \"Belgique\",\n        \"description\": \"La Leffe ou Abbaye de Leffe est une bière belge d'Abbaye reconnue, créée en 1240 par les chanoines de l'ordre de Prémontré de l'abbaye Notre-Dame de Leffe et produite par la brasserie Artois à Louvain.\",\n        \"birthDate\": \"1997-05-22T00:00:00.000Z\",\n        \"updated_at\": \"2019-04-14T09:20:46.668Z\",\n        \"created_at\": \"2019-04-14T09:20:46.668Z\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la création de la bière\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/beer.js",
    "groupTitle": "Beers",
    "name": "PostBeersCreate"
  },
  {
    "type": "put",
    "url": "beers/:beer_id/addTypeOfBeer",
    "title": "add link between type of beer and beer",
    "group": "Beers",
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
            "field": "typeOfBeer_id",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"typeOfBeer_id\": 1\n}",
          "type": "json"
        }
      ]
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
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": message\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/beer.js",
    "groupTitle": "Beers",
    "name": "PutBeersBeer_idAddtypeofbeer"
  },
  {
    "type": "put",
    "url": "beers/:beer_id/deleteTypeOfBeer/:typeOfBeer_id",
    "title": "delete link between type of beer and beer",
    "group": "Beers",
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
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": message\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/beer.js",
    "groupTitle": "Beers",
    "name": "PutBeersBeer_idDeletetypeofbeerTypeofbeer_id"
  },
  {
    "type": "put",
    "url": "beers/update/:beer_id",
    "title": "update beer",
    "group": "Beers",
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
            "description": "<p>obligatoire et entre 2 à 200 caractères</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "color",
            "description": "<p>obligatoire et entre 2 à 100 caractères</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "origin",
            "description": "<p>obligatoire, entre 2 et 150 caractères, avec au moins une lettre majuscule, majuscule et un chiffre</p>"
          },
          {
            "group": "Parameter",
            "type": "Text",
            "optional": false,
            "field": "description",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"color\": \"Brune\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 201 Created\n{\n    \"error\": false,\n    \"beer\": {\n        \"id\": 1,\n        \"name\": \"Leffe\",\n        \"color\": \"blanche\",\n        \"origin\": \"Belgique\",\n        \"description\": \"La Leffe ou Abbaye de Leffe est une bière belge d'Abbaye reconnue, créée en 1240 par les chanoines de l'ordre de Prémontré de l'abbaye Notre-Dame de Leffe et produite par la brasserie Artois à Louvain.\",\n        \"pathPicture\": null,\n        \"updated_at\": \"2019-04-14T09:21:46.668Z\",\n        \"created_at\": \"2019-04-14T09:20:46.668Z\"\n        \"deleted_at\": null\n    }\n}",
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
    "filename": "configs/Routes/beer.js",
    "groupTitle": "Beers",
    "name": "PutBeersUpdateBeer_id"
  },
  {
    "type": "put",
    "url": "beers/upload/:beer_id",
    "title": "upload picture beer",
    "group": "Beers",
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
    "filename": "configs/Routes/beer.js",
    "groupTitle": "Beers",
    "name": "PutBeersUploadBeer_id"
  },
  {
    "type": "delete",
    "url": "brewerys/delete/:brewery_id",
    "title": "delete brewery",
    "group": "Brewerys",
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
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"La brasserie n'existe pas\"\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération de la brasserie\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/brewery.js",
    "groupTitle": "Brewerys",
    "name": "DeleteBrewerysDeleteBrewery_id"
  },
  {
    "type": "get",
    "url": "brewerys/:brewery_id",
    "title": "get brewery",
    "group": "Brewerys",
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 Success\n{\n   \"error\": false,\n   \"message\": {\n       \"id\": 1,\n       \"name\": \"La dernière brasserie avant la fin du monde\",\n       \"gpsLatitude\": 48,\n       \"gpsLongitude\": 2.3461672,\n       \"description\": \"Coucou\",\n       \"webSiteLink\": \"https://www.facebook.com/?ref=tn_tnmn\",\n       \"created_at\": \"2019-04-14T13:42:47.000Z\",\n       \"updated_at\": \"2019-04-14T13:42:47.000Z\",\n       \"deleted_at\": null,\n       \"user_id\": 1\n   }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"La brasserie n'existe pas\"\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération de la brasserie\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/brewery.js",
    "groupTitle": "Brewerys",
    "name": "GetBrewerysBrewery_id"
  },
  {
    "type": "get",
    "url": "brewerys/?name=name&user_id=user_id",
    "title": "get all brewerys",
    "group": "Brewerys",
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
          "content": " HTTP/1.1 200 Success\n{\n   \"error\": false,\n   \"message\": [\n       {\n           \"id\": 1,\n           \"name\": \"La dernière brasserie avant la fin du monde\",\n           \"gpsLatitude\": 48,\n           \"gpsLongitude\": 2.3461672,\n           \"description\": \"Coucou\",\n           \"webSiteLink\": \"https://www.facebook.com/?ref=tn_tnmn\",\n           \"created_at\": \"2019-04-14T13:42:47.000Z\",\n           \"updated_at\": \"2019-04-14T13:42:47.000Z\",\n           \"deleted_at\": null,\n           \"user_id\": 1\n       }\n   ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"Aucune brasserie trouvé\"\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération des brasseries\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/brewery.js",
    "groupTitle": "Brewerys",
    "name": "GetBrewerysNameNameUser_idUser_id"
  },
  {
    "type": "post",
    "url": "brewerys/create",
    "title": "add a new brewery",
    "group": "Brewerys",
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
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "facebokLink",
            "description": "<p>format url</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "twitterLink",
            "description": "<p>format url</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "instagramLink",
            "description": "<p>format url</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"name\": \"La dernière brasserie avant la fin du monde\",\n  \"gpsLatitude\": \"48.\",\n  \"gpsLongitude\": \"2.3461672\",\n  \"description\": \"Coucou\",\n  \"webSiteLink\": \"https://www.facebook.com/?ref=tn_tnmn\",\n  \"facebokLink\": \"https://www.facebook.com/?ref=tn_tnmn\",\n  \"twitterLink\": \"https://www.facebook.com/?ref=tn_tnmn\",\n  \"instagramLink\": \"https://www.facebook.com/?ref=tn_tnmn\"\n}",
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
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la création de votre brasserie\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/brewery.js",
    "groupTitle": "Brewerys",
    "name": "PostBrewerysCreate"
  },
  {
    "type": "put",
    "url": "brewerys/update/:brewery_id",
    "title": "update brewery",
    "group": "Brewerys",
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
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "facebokLink",
            "description": "<p>format url</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "twitterLink",
            "description": "<p>format url</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "instagramLink",
            "description": "<p>format url</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"name\": \"La dernière brasserie avant la fin du monde\",\n  \"gpsLatitude\": \"48.\",\n  \"gpsLongitude\": \"2.3461672\",\n  \"description\": \"Coucou\",\n  \"webSiteLink\": \"https://www.facebook.com/?ref=tn_tnmn\",\n  \"facebokLink\": \"https://www.facebook.com/?ref=tn_tnmn\",\n  \"twitterLink\": \"https://www.facebook.com/?ref=tn_tnmn\",\n  \"instagramLink\": \"https://www.facebook.com/?ref=tn_tnmn\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 Success\n   {\n       \"error\": false\n   }",
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
    "filename": "configs/Routes/brewery.js",
    "groupTitle": "Brewerys",
    "name": "PutBrewerysUpdateBrewery_id"
  },
  {
    "type": "delete",
    "url": "commentsBars/delete/:commentsBar_id",
    "title": "delete commentsBar",
    "group": "CommentsBars",
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
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"Le commentaire n'existe pas\"\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération du commentaire\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/commentsBar.js",
    "groupTitle": "CommentsBars",
    "name": "DeleteCommentsbarsDeleteCommentsbar_id"
  },
  {
    "type": "get",
    "url": "commentsBars/?bar_id=bar_id&user_id=user_id",
    "title": "get all commentsBars",
    "group": "CommentsBars",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "bar_id",
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
          "content": " HTTP/1.1 200 Success\n{\n   \"error\": false,\n   \"message\": [\n       {\n           \"id\": 1,\n           \"text\": \"J'adore ce bar\",\n           \"bar_id\": 1,\n           \"user_id\": 1,\n           \"created_at\": \"2019-04-14T13:42:47.000Z\",\n           \"updated_at\": \"2019-04-14T13:42:47.000Z\",\n           \"deleted_at\": null\n       }\n   ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"Aucun commentaire trouvé\"\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération des commentaires\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/commentsBar.js",
    "groupTitle": "CommentsBars",
    "name": "GetCommentsbarsBar_idBar_idUser_idUser_id"
  },
  {
    "type": "get",
    "url": "commentsBars/:commentsBar_id",
    "title": "get commentsBar",
    "group": "CommentsBars",
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 Success\n{\n   \"error\": false,\n   \"message\": {\n           \"id\": 1,\n           \"text\": \"J'adore ce bar\",\n           \"bar_id\": 1,\n           \"user_id\": 1,\n           \"created_at\": \"2019-04-14T13:42:47.000Z\",\n           \"updated_at\": \"2019-04-14T13:42:47.000Z\",\n           \"deleted_at\": null\n   }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"Le commentaire n'existe pas\"\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération du commentaire\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/commentsBar.js",
    "groupTitle": "CommentsBars",
    "name": "GetCommentsbarsCommentsbar_id"
  },
  {
    "type": "post",
    "url": "commentsBars/create",
    "title": "add a new commentsBar",
    "group": "CommentsBars",
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
            "field": "text",
            "description": "<p>obligatoire</p>"
          },
          {
            "group": "Parameter",
            "type": "Int",
            "optional": false,
            "field": "bar_id",
            "description": "<p>obligatoire</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"text\": \"J'adore ce bar\",\n  \"bar_id\": \"1\"\n}",
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
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la création de votre commentaire\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/commentsBar.js",
    "groupTitle": "CommentsBars",
    "name": "PostCommentsbarsCreate"
  },
  {
    "type": "put",
    "url": "commentsBars/update/:commentsBar_id",
    "title": "update commentsBar",
    "group": "CommentsBars",
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
            "field": "text",
            "description": "<p>obligatoire</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n   \"text\": \"J'adore ce bar\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 Success\n   {\n       \"error\": false\n   }",
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
    "filename": "configs/Routes/commentsBar.js",
    "groupTitle": "CommentsBars",
    "name": "PutCommentsbarsUpdateCommentsbar_id"
  },
  {
    "type": "delete",
    "url": "commentsBeers/delete/:commentsBeer_id",
    "title": "delete commentsBeer",
    "group": "CommentsBeers",
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
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"Le commentaire n'existe pas\"\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération du commentaire\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/commentsBeer.js",
    "groupTitle": "CommentsBeers",
    "name": "DeleteCommentsbeersDeleteCommentsbeer_id"
  },
  {
    "type": "get",
    "url": "commentsBeers/?beer_id=beer_id&user_id=user_id",
    "title": "get all commentsBeers",
    "group": "CommentsBeers",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "beer_id",
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
          "content": " HTTP/1.1 200 Success\n{\n   \"error\": false,\n   \"message\": [\n       {\n           \"id\": 1,\n           \"text\": \"J'adore cette bière\",\n           \"beer_id\": 1,\n           \"user_id\": 1,\n           \"created_at\": \"2019-04-14T13:42:47.000Z\",\n           \"updated_at\": \"2019-04-14T13:42:47.000Z\",\n           \"deleted_at\": null\n       }\n   ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"Aucun commentaire trouvé\"\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération des commentaires\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/commentsBeer.js",
    "groupTitle": "CommentsBeers",
    "name": "GetCommentsbeersBeer_idBeer_idUser_idUser_id"
  },
  {
    "type": "get",
    "url": "commentsBeers/:commentsBeer_id",
    "title": "get commentsBeer",
    "group": "CommentsBeers",
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 Success\n{\n   \"error\": false,\n   \"message\": {\n           \"id\": 1,\n           \"text\": \"J'adore cette bière\",\n           \"beer_id\": 1,\n           \"user_id\": 1,\n           \"created_at\": \"2019-04-14T13:42:47.000Z\",\n           \"updated_at\": \"2019-04-14T13:42:47.000Z\",\n           \"deleted_at\": null\n   }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"Le commentaire n'existe pas\"\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération du commentaire\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/commentsBeer.js",
    "groupTitle": "CommentsBeers",
    "name": "GetCommentsbeersCommentsbeer_id"
  },
  {
    "type": "post",
    "url": "commentsBeers/create",
    "title": "add a new commentsBeer",
    "group": "CommentsBeers",
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
            "field": "text",
            "description": "<p>obligatoire</p>"
          },
          {
            "group": "Parameter",
            "type": "Int",
            "optional": false,
            "field": "beer_id",
            "description": "<p>obligatoire</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"text\": \"J'adore cette bière\",\n  \"beer_id\": \"1\"\n}",
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
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la création de votre commentaire\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/commentsBeer.js",
    "groupTitle": "CommentsBeers",
    "name": "PostCommentsbeersCreate"
  },
  {
    "type": "put",
    "url": "commentsBeers/update/:commentsBeer_id",
    "title": "update commentsBeer",
    "group": "CommentsBeers",
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
            "field": "text",
            "description": "<p>obligatoire</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n   \"text\": \"J'adore cette bière\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 Success\n   {\n       \"error\": false\n   }",
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
    "filename": "configs/Routes/commentsBeer.js",
    "groupTitle": "CommentsBeers",
    "name": "PutCommentsbeersUpdateCommentsbeer_id"
  },
  {
    "type": "delete",
    "url": "commentsBrewerys/delete/:commentsBrewery_id",
    "title": "delete commentsBrewery",
    "group": "CommentsBrewerys",
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
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"Le commentaire n'existe pas\"\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération du commentaire\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/commentsBrewery.js",
    "groupTitle": "CommentsBrewerys",
    "name": "DeleteCommentsbrewerysDeleteCommentsbrewery_id"
  },
  {
    "type": "get",
    "url": "commentsBrewerys/?brewery_id=brewery_id&user_id=user_id",
    "title": "get all commentsBrewerys",
    "group": "CommentsBrewerys",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "brewery_id",
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
          "content": " HTTP/1.1 200 Success\n{\n   \"error\": false,\n   \"message\": [\n       {\n           \"id\": 1,\n           \"text\": \"J'adore cette brasserie\",\n           \"brewery_id\": 1,\n           \"user_id\": 1,\n           \"created_at\": \"2019-04-14T13:42:47.000Z\",\n           \"updated_at\": \"2019-04-14T13:42:47.000Z\",\n           \"deleted_at\": null\n       }\n   ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"Aucun commentaire trouvé\"\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération des commentaires\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/commentsBrewery.js",
    "groupTitle": "CommentsBrewerys",
    "name": "GetCommentsbrewerysBrewery_idBrewery_idUser_idUser_id"
  },
  {
    "type": "get",
    "url": "commentsBrewerys/:commentsBrewery_id",
    "title": "get commentsBrewery",
    "group": "CommentsBrewerys",
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 Success\n{\n   \"error\": false,\n   \"message\": {\n           \"id\": 1,\n           \"text\": \"J'adore cette brasserie\",\n           \"brewery_id\": 1,\n           \"user_id\": 1,\n           \"created_at\": \"2019-04-14T13:42:47.000Z\",\n           \"updated_at\": \"2019-04-14T13:42:47.000Z\",\n           \"deleted_at\": null\n   }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"Le commentaire n'existe pas\"\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération du commentaire\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/commentsBrewery.js",
    "groupTitle": "CommentsBrewerys",
    "name": "GetCommentsbrewerysCommentsbrewery_id"
  },
  {
    "type": "post",
    "url": "commentsBrewerys/create",
    "title": "add a new commentsBrewery",
    "group": "CommentsBrewerys",
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
            "field": "text",
            "description": "<p>obligatoire</p>"
          },
          {
            "group": "Parameter",
            "type": "Int",
            "optional": false,
            "field": "brewery_id",
            "description": "<p>obligatoire</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"text\": \"J'adore cette brasserie\",\n  \"brewery_id\": \"1\"\n}",
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
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la création de votre commentaire\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/commentsBrewery.js",
    "groupTitle": "CommentsBrewerys",
    "name": "PostCommentsbrewerysCreate"
  },
  {
    "type": "put",
    "url": "commentsBrewerys/update/:commentsBrewery_id",
    "title": "update commentsBrewery",
    "group": "CommentsBrewerys",
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
            "field": "text",
            "description": "<p>obligatoire</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n   \"text\": \"J'adore cette brasserie\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 Success\n   {\n       \"error\": false\n   }",
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
    "filename": "configs/Routes/commentsBrewery.js",
    "groupTitle": "CommentsBrewerys",
    "name": "PutCommentsbrewerysUpdateCommentsbrewery_id"
  },
  {
    "type": "delete",
    "url": "menusBeers/delete/:menusBeer_id",
    "title": "delete menusBeer",
    "group": "MenusBeers",
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
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": message\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/menusBeer.js",
    "groupTitle": "MenusBeers",
    "name": "DeleteMenusbeersDeleteMenusbeer_id"
  },
  {
    "type": "get",
    "url": "menusBeers/?bar_id=bar_id&beer_id=beer_id",
    "title": "get all menusBeers",
    "group": "MenusBeers",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "bar_id",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "beer_id",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": " HTTP/1.1 200 Success\n{\n   \"error\": false,\n   \"message\": [\n       {\n           \"id\": 1,\n           \"price\": \"10.00\",\n           \"bar_id\": 1,\n           \"beer_id\": 1,\n           \"created_at\": \"2019-04-14T13:42:47.000Z\",\n           \"updated_at\": \"2019-04-14T13:42:47.000Z\",\n           \"deleted_at\": null\n       }\n   ]\n}",
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
    "filename": "configs/Routes/menusBeer.js",
    "groupTitle": "MenusBeers",
    "name": "GetMenusbeersBar_idBar_idBeer_idBeer_id"
  },
  {
    "type": "get",
    "url": "menusBeers/:menusBeer_id",
    "title": "get menusBeer",
    "group": "MenusBeers",
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 Success\n{\n   \"error\": false,\n   \"message\": {\n           \"id\": 1,\n           \"price\": \"10.00\",\n           \"bar_id\": 1,\n           \"beer_id\": 1,\n           \"created_at\": \"2019-04-14T13:42:47.000Z\",\n           \"updated_at\": \"2019-04-14T13:42:47.000Z\",\n           \"deleted_at\": null\n   }\n}",
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
    "filename": "configs/Routes/menusBeer.js",
    "groupTitle": "MenusBeers",
    "name": "GetMenusbeersMenusbeer_id"
  },
  {
    "type": "post",
    "url": "menusBeers/create",
    "title": "add a new menusBeer",
    "group": "MenusBeers",
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
            "field": "price",
            "description": "<p>obligatoire</p>"
          },
          {
            "group": "Parameter",
            "type": "Int",
            "optional": false,
            "field": "bar_id",
            "description": "<p>obligatoire</p>"
          },
          {
            "group": "Parameter",
            "type": "Int",
            "optional": false,
            "field": "beer_id",
            "description": "<p>obligatoire</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"price\": \"8.60\",\n  \"beer_id\": \"1\",\n  \"bar_id\": \"1\"\n}",
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
    "filename": "configs/Routes/menusBeer.js",
    "groupTitle": "MenusBeers",
    "name": "PostMenusbeersCreate"
  },
  {
    "type": "delete",
    "url": "notesBars/delete/:notesBar_id",
    "title": "delete notesBar",
    "group": "NotesBars",
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
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"La note n'existe pas\"\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération de la note\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/notesBar.js",
    "groupTitle": "NotesBars",
    "name": "DeleteNotesbarsDeleteNotesbar_id"
  },
  {
    "type": "get",
    "url": "notesBars/?bar_id=bar_id&user_id=user_id",
    "title": "get all notesBars",
    "group": "NotesBars",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "bar_id",
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
          "content": " HTTP/1.1 200 Success\n{\n   \"error\": false,\n   \"message\": [\n       {\n           \"id\": 1,\n           \"note\": 15,\n           \"bar_id\": 1,\n           \"user_id\": 1,\n           \"created_at\": \"2019-04-14T13:42:47.000Z\",\n           \"updated_at\": \"2019-04-14T13:42:47.000Z\",\n           \"deleted_at\": null\n       }\n   ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"Aucune note trouvé\"\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération des notes\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/notesBar.js",
    "groupTitle": "NotesBars",
    "name": "GetNotesbarsBar_idBar_idUser_idUser_id"
  },
  {
    "type": "get",
    "url": "notesBars/:notesBar_id",
    "title": "get notesBar",
    "group": "NotesBars",
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 Success\n{\n   \"error\": false,\n   \"message\": {\n           \"id\": 1,\n           \"note\": 15,\n           \"bar_id\": 1,\n           \"user_id\": 1,\n           \"created_at\": \"2019-04-14T13:42:47.000Z\",\n           \"updated_at\": \"2019-04-14T13:42:47.000Z\",\n           \"deleted_at\": null\n   }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"La note n'existe pas\"\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération de la note\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/notesBar.js",
    "groupTitle": "NotesBars",
    "name": "GetNotesbarsNotesbar_id"
  },
  {
    "type": "post",
    "url": "notesBars/create",
    "title": "add a new notesBar",
    "group": "NotesBars",
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
            "field": "note",
            "description": "<p>obligatoire</p>"
          },
          {
            "group": "Parameter",
            "type": "Int",
            "optional": false,
            "field": "bar_id",
            "description": "<p>obligatoire</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"note\": 15,\n  \"bar_id\": \"1\"\n}",
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
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la création de votre note\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/notesBar.js",
    "groupTitle": "NotesBars",
    "name": "PostNotesbarsCreate"
  },
  {
    "type": "put",
    "url": "notesBars/update/:notesBar_id",
    "title": "update notesBar",
    "group": "NotesBars",
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
            "field": "note",
            "description": "<p>obligatoire</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n   \"note\": 15,\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 Success\n   {\n       \"error\": false\n   }",
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
    "filename": "configs/Routes/notesBar.js",
    "groupTitle": "NotesBars",
    "name": "PutNotesbarsUpdateNotesbar_id"
  },
  {
    "type": "delete",
    "url": "notesBeers/delete/:notesBeer_id",
    "title": "delete notesBeer",
    "group": "NotesBeers",
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
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"La note n'existe pas\"\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération de la note\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/notesBeer.js",
    "groupTitle": "NotesBeers",
    "name": "DeleteNotesbeersDeleteNotesbeer_id"
  },
  {
    "type": "get",
    "url": "notesBeers/?beer_id=beer_id&user_id=user_id",
    "title": "get all notesBeers",
    "group": "NotesBeers",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "beer_id",
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
          "content": " HTTP/1.1 200 Success\n{\n   \"error\": false,\n   \"message\": [\n       {\n           \"id\": 1,\n           \"note\": 15,\n           \"beer_id\": 1,\n           \"user_id\": 1,\n           \"created_at\": \"2019-04-14T13:42:47.000Z\",\n           \"updated_at\": \"2019-04-14T13:42:47.000Z\",\n           \"deleted_at\": null\n       }\n   ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"Aucune note trouvé\"\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération des notes\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/notesBeer.js",
    "groupTitle": "NotesBeers",
    "name": "GetNotesbeersBeer_idBeer_idUser_idUser_id"
  },
  {
    "type": "get",
    "url": "notesBeers/:notesBeer_id",
    "title": "get notesBeer",
    "group": "NotesBeers",
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 Success\n{\n   \"error\": false,\n   \"message\": {\n           \"id\": 1,\n           \"note\": 15,\n           \"beer_id\": 1,\n           \"user_id\": 1,\n           \"created_at\": \"2019-04-14T13:42:47.000Z\",\n           \"updated_at\": \"2019-04-14T13:42:47.000Z\",\n           \"deleted_at\": null\n   }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"La note n'existe pas\"\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération de la note\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/notesBeer.js",
    "groupTitle": "NotesBeers",
    "name": "GetNotesbeersNotesbeer_id"
  },
  {
    "type": "post",
    "url": "notesBeers/create",
    "title": "add a new notesBeer",
    "group": "NotesBeers",
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
            "field": "note",
            "description": "<p>obligatoire</p>"
          },
          {
            "group": "Parameter",
            "type": "Int",
            "optional": false,
            "field": "beer_id",
            "description": "<p>obligatoire</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"note\": 15,\n  \"beer_id\": \"1\"\n}",
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
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la création de votre note\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/notesBeer.js",
    "groupTitle": "NotesBeers",
    "name": "PostNotesbeersCreate"
  },
  {
    "type": "put",
    "url": "notesBeers/update/:notesBeer_id",
    "title": "update notesBeer",
    "group": "NotesBeers",
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
            "field": "note",
            "description": "<p>obligatoire</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n   \"note\": 15,\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 Success\n   {\n       \"error\": false\n   }",
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
    "filename": "configs/Routes/notesBeer.js",
    "groupTitle": "NotesBeers",
    "name": "PutNotesbeersUpdateNotesbeer_id"
  },
  {
    "type": "delete",
    "url": "notesBrewerys/delete/:notesBrewery_id",
    "title": "delete notesBrewery",
    "group": "NotesBrewerys",
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
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"La note n'existe pas\"\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération de la note\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/notesBrewery.js",
    "groupTitle": "NotesBrewerys",
    "name": "DeleteNotesbrewerysDeleteNotesbrewery_id"
  },
  {
    "type": "get",
    "url": "notesBrewerys/?brewery_id=brewery_id&user_id=user_id",
    "title": "get all notesBrewerys",
    "group": "NotesBrewerys",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "brewery_id",
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
          "content": " HTTP/1.1 200 Success\n{\n   \"error\": false,\n   \"message\": [\n       {\n           \"id\": 1,\n           \"note\": 15,\n           \"brewery_id\": 1,\n           \"user_id\": 1,\n           \"created_at\": \"2019-04-14T13:42:47.000Z\",\n           \"updated_at\": \"2019-04-14T13:42:47.000Z\",\n           \"deleted_at\": null\n       }\n   ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"Aucune note trouvé\"\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération des notes\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/notesBrewery.js",
    "groupTitle": "NotesBrewerys",
    "name": "GetNotesbrewerysBrewery_idBrewery_idUser_idUser_id"
  },
  {
    "type": "get",
    "url": "notesBrewerys/:notesBrewery_id",
    "title": "get notesBrewery",
    "group": "NotesBrewerys",
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 Success\n{\n   \"error\": false,\n   \"message\": {\n           \"id\": 1,\n           \"note\": 15,\n           \"brewery_id\": 1,\n           \"user_id\": 1,\n           \"created_at\": \"2019-04-14T13:42:47.000Z\",\n           \"updated_at\": \"2019-04-14T13:42:47.000Z\",\n           \"deleted_at\": null\n   }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"La note n'existe pas\"\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération de la note\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/notesBrewery.js",
    "groupTitle": "NotesBrewerys",
    "name": "GetNotesbrewerysNotesbrewery_id"
  },
  {
    "type": "post",
    "url": "notesBrewerys/create",
    "title": "add a new notesBrewery",
    "group": "NotesBrewerys",
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
            "field": "note",
            "description": "<p>obligatoire</p>"
          },
          {
            "group": "Parameter",
            "type": "Int",
            "optional": false,
            "field": "brewery_id",
            "description": "<p>obligatoire</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"note\": 15,\n  \"brewery_id\": \"1\"\n}",
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
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la création de votre note\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/notesBrewery.js",
    "groupTitle": "NotesBrewerys",
    "name": "PostNotesbrewerysCreate"
  },
  {
    "type": "put",
    "url": "notesBrewerys/update/:notesBrewery_id",
    "title": "update notesBrewery",
    "group": "NotesBrewerys",
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
            "field": "note",
            "description": "<p>obligatoire</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n   \"note\": 15,\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 Success\n   {\n       \"error\": false\n   }",
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
    "filename": "configs/Routes/notesBrewery.js",
    "groupTitle": "NotesBrewerys",
    "name": "PutNotesbrewerysUpdateNotesbrewery_id"
  },
  {
    "type": "delete",
    "url": "orderMenuBeers/delete/:orderMenuBeer_id",
    "title": "delete orderMenuBeer",
    "group": "OrderMenuBeers",
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
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": message\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/orderMenuBeer.js",
    "groupTitle": "OrderMenuBeers",
    "name": "DeleteOrdermenubeersDeleteOrdermenubeer_id"
  },
  {
    "type": "get",
    "url": "orderMenuBeers/?menuBeer_id=menuBeer_id&reservation_id=reservation_id",
    "title": "get all orderMenuBeers",
    "group": "OrderMenuBeers",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "menuBeer_id",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "reservation_id",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": " HTTP/1.1 200 Success\n{\n   \"error\": false,\n   \"message\": [\n       {\n           \"id\": 1,\n           \"quantity\": 8,\n           \"menuBeer_id\": 1,\n           \"reservation_id\": 1,\n           \"created_at\": \"2019-04-14T13:42:47.000Z\",\n           \"updated_at\": \"2019-04-14T13:42:47.000Z\",\n           \"deleted_at\": null\n       }\n   ]\n}",
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
    "filename": "configs/Routes/orderMenuBeer.js",
    "groupTitle": "OrderMenuBeers",
    "name": "GetOrdermenubeersMenubeer_idMenubeer_idReservation_idReservation_id"
  },
  {
    "type": "get",
    "url": "orderMenuBeers/:orderMenuBeer_id",
    "title": "get orderMenuBeer",
    "group": "OrderMenuBeers",
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 Success\n{\n   \"error\": false,\n   \"message\": {\n           \"id\": 1,\n           \"quantity\": 8,\n           \"menuBeer_id\": 1,\n           \"reservation_id\": 1,\n           \"created_at\": \"2019-04-14T13:42:47.000Z\",\n           \"updated_at\": \"2019-04-14T13:42:47.000Z\",\n           \"deleted_at\": null\n   }\n}",
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
    "filename": "configs/Routes/orderMenuBeer.js",
    "groupTitle": "OrderMenuBeers",
    "name": "GetOrdermenubeersOrdermenubeer_id"
  },
  {
    "type": "post",
    "url": "orderMenuBeers/create",
    "title": "add a new orderMenuBeer",
    "group": "OrderMenuBeers",
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
            "type": "int",
            "optional": false,
            "field": "quantity",
            "description": "<p>obligatoire</p>"
          },
          {
            "group": "Parameter",
            "type": "Int",
            "optional": false,
            "field": "reservation_id",
            "description": "<p>obligatoire</p>"
          },
          {
            "group": "Parameter",
            "type": "Int",
            "optional": false,
            "field": "menuBeer_id",
            "description": "<p>obligatoire</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"quantity\": 8,\n  \"reservation_id\": \"1\",\n  \"menuBeer_id\": \"1\"\n}",
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
    "filename": "configs/Routes/orderMenuBeer.js",
    "groupTitle": "OrderMenuBeers",
    "name": "PostOrdermenubeersCreate"
  },
  {
    "type": "put",
    "url": "orderMenuBeers/update/:orderMenuBeer_id",
    "title": "update orderMenuBeer",
    "group": "OrderMenuBeers",
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
            "type": "int",
            "optional": false,
            "field": "quantity",
            "description": "<p>obligatoire</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n    \"numberOfPeople\": 8\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 Success\n   {\n       \"error\": false\n   }",
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
    "filename": "configs/Routes/orderMenuBeer.js",
    "groupTitle": "OrderMenuBeers",
    "name": "PutOrdermenubeersUpdateOrdermenubeer_id"
  },
  {
    "type": "get",
    "url": "picturesBars/download/:picturesBar_id",
    "title": "download picture bar",
    "group": "PicturesBar",
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
    "filename": "configs/Routes/picturesBar.js",
    "groupTitle": "PicturesBar",
    "name": "GetPicturesbarsDownloadPicturesbar_id"
  },
  {
    "type": "delete",
    "url": "picturesBars/delete/:picturesBar_id",
    "title": "delete picturesBar",
    "group": "PicturesBars",
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
    "filename": "configs/Routes/picturesBar.js",
    "groupTitle": "PicturesBars",
    "name": "DeletePicturesbarsDeletePicturesbar_id"
  },
  {
    "type": "get",
    "url": "picturesBars/?bar_id=bar_id",
    "title": "get all picturesBars",
    "group": "PicturesBars",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "bar_id",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "   HTTP/1.1 200 Success\n{\n   \"error\": false,\n   \"message\": [\n       {\n           \"id\": 1,\n           \"pathPicture\": \"a.png,\n           \"created_at\": \"2019-04-14T13:42:47.000Z\",\n           \"updated_at\": \"2019-04-14T13:42:47.000Z\",\n           \"deleted_at\": null,\n           \"bar_id\": 1\n       }\n   ]\n}",
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
    "filename": "configs/Routes/picturesBar.js",
    "groupTitle": "PicturesBars",
    "name": "GetPicturesbarsBar_idBar_id"
  },
  {
    "type": "post",
    "url": "picturesBars/create",
    "title": "add a new picture to bar",
    "group": "PicturesBars",
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
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "bar_id",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"bar_id\": 1\n}",
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
    "filename": "configs/Routes/picturesBar.js",
    "groupTitle": "PicturesBars",
    "name": "PostPicturesbarsCreate"
  },
  {
    "type": "get",
    "url": "picturesBrewerys/download/:picturesBrewery_id",
    "title": "download picture brewery",
    "group": "PicturesBrewery",
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
    "filename": "configs/Routes/picturesBrewery.js",
    "groupTitle": "PicturesBrewery",
    "name": "GetPicturesbrewerysDownloadPicturesbrewery_id"
  },
  {
    "type": "delete",
    "url": "picturesBrewerys/delete/:picturesBrewery_id",
    "title": "delete picturesBrewery",
    "group": "PicturesBrewerys",
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
    "filename": "configs/Routes/picturesBrewery.js",
    "groupTitle": "PicturesBrewerys",
    "name": "DeletePicturesbrewerysDeletePicturesbrewery_id"
  },
  {
    "type": "get",
    "url": "picturesBrewerys/?brewery_id=brewery_id",
    "title": "get all picturesBrewerys",
    "group": "PicturesBrewerys",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "brewery_id",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "   HTTP/1.1 200 Success\n{\n   \"error\": false,\n   \"message\": [\n       {\n           \"id\": 1,\n           \"pathPicture\": \"a.png,\n           \"created_at\": \"2019-04-14T13:42:47.000Z\",\n           \"updated_at\": \"2019-04-14T13:42:47.000Z\",\n           \"deleted_at\": null,\n           \"brewery_id\": 1\n       }\n   ]\n}",
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
    "filename": "configs/Routes/picturesBrewery.js",
    "groupTitle": "PicturesBrewerys",
    "name": "GetPicturesbrewerysBrewery_idBrewery_id"
  },
  {
    "type": "post",
    "url": "picturesBrewerys/create",
    "title": "add a new picture to brewery",
    "group": "PicturesBrewerys",
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
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "brewery_id",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"brewery_id\": 1\n}",
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
    "filename": "configs/Routes/picturesBrewery.js",
    "groupTitle": "PicturesBrewerys",
    "name": "PostPicturesbrewerysCreate"
  },
  {
    "type": "delete",
    "url": "reservations/delete/:reservation_id",
    "title": "delete reservation",
    "group": "Reservations",
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
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": message\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/reservation.js",
    "groupTitle": "Reservations",
    "name": "DeleteReservationsDeleteReservation_id"
  },
  {
    "type": "get",
    "url": "reservations/?bar_id=bar_id&user_id=user_id",
    "title": "get all reservations",
    "group": "Reservations",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "bar_id",
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
          "content": " HTTP/1.1 200 Success\n{\n   \"error\": false,\n   \"message\": [\n       {\n           \"id\": 1,\n           \"numberOfPeople\": 8,\n           \"arrivalTime\": \"26/04/2019 18:00\",\n           \"bar_id\": 1,\n           \"user_id\": 1,\n           \"created_at\": \"2019-04-14T13:42:47.000Z\",\n           \"updated_at\": \"2019-04-14T13:42:47.000Z\",\n           \"deleted_at\": null\n       }\n   ]\n}",
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
    "filename": "configs/Routes/reservation.js",
    "groupTitle": "Reservations",
    "name": "GetReservationsBar_idBar_idUser_idUser_id"
  },
  {
    "type": "get",
    "url": "reservations/:reservation_id",
    "title": "get reservation",
    "group": "Reservations",
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 Success\n{\n   \"error\": false,\n   \"message\": {\n           \"id\": 1,\n           \"numberOfPeople\": 8,\n           \"arrivalTime\": \"26/04/2019 18:00\",\n           \"bar_id\": 1,\n           \"user_id\": 1,\n           \"created_at\": \"2019-04-14T13:42:47.000Z\",\n           \"updated_at\": \"2019-04-14T13:42:47.000Z\",\n           \"deleted_at\": null\n   }\n}",
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
    "filename": "configs/Routes/reservation.js",
    "groupTitle": "Reservations",
    "name": "GetReservationsReservation_id"
  },
  {
    "type": "post",
    "url": "reservations/create",
    "title": "add a new reservation",
    "group": "Reservations",
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
            "type": "int",
            "optional": false,
            "field": "numberOfPeople",
            "description": "<p>obligatoire</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "arrivalTime",
            "description": "<p>obligatoire</p>"
          },
          {
            "group": "Parameter",
            "type": "Int",
            "optional": false,
            "field": "bar_id",
            "description": "<p>obligatoire</p>"
          },
          {
            "group": "Parameter",
            "type": "Int",
            "optional": false,
            "field": "user_id",
            "description": "<p>obligatoire</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"numberOfPeople\": 8,\n  \"arrivalTime\": \"26/04/2019 18:00\",\n  \"user_id\": \"1\",\n  \"bar_id\": \"1\"\n}",
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
    "filename": "configs/Routes/reservation.js",
    "groupTitle": "Reservations",
    "name": "PostReservationsCreate"
  },
  {
    "type": "put",
    "url": "reservations/update/:reservation_id",
    "title": "update reservation",
    "group": "Reservations",
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
            "type": "int",
            "optional": false,
            "field": "numberOfPeople",
            "description": "<p>obligatoire</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "arrivalTime",
            "description": "<p>obligatoire</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n    \"numberOfPeople\": 8,\n    \"arrivalTime\": \"26/04/2019 18:00\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 Success\n   {\n       \"error\": false\n   }",
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
    "filename": "configs/Routes/reservation.js",
    "groupTitle": "Reservations",
    "name": "PutReservationsUpdateReservation_id"
  },
  {
    "type": "put",
    "url": "reservations/valid/:reservation_id",
    "title": "update reservation",
    "group": "Reservations",
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
            "type": "bool",
            "optional": false,
            "field": "valid",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n    \"valid\": true\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 Success\n   {\n       \"error\": false\n   }",
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
    "filename": "configs/Routes/reservation.js",
    "groupTitle": "Reservations",
    "name": "PutReservationsValidReservation_id"
  },
  {
    "type": "delete",
    "url": "typeOfBeers/delete/:typeOfBeer_id",
    "title": "delete type of beer",
    "group": "TypeOfBeers",
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
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"Le type de bière n'existe pas\"\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération du type de bières\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/typeOfBeer.js",
    "groupTitle": "TypeOfBeers",
    "name": "DeleteTypeofbeersDeleteTypeofbeer_id"
  },
  {
    "type": "get",
    "url": "typeOfBeers/download/:typeOfBeer_id",
    "title": "download picture typeOfBeer",
    "group": "TypeOfBeers",
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
    "filename": "configs/Routes/typeOfBeer.js",
    "groupTitle": "TypeOfBeers",
    "name": "GetTypeofbeersDownloadTypeofbeer_id"
  },
  {
    "type": "get",
    "url": "typeOfBeers/?name=name",
    "title": "get all type of beer",
    "group": "TypeOfBeers",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "HTTP/1.1 200 Success",
          "content": " HTTP/1.1 200 Success\n{\n   \"error\": false,\n   \"message\": [\n       {\n           \"id\": 1,\n           \"name\": \"Blonde\",\n           \"created_at\": \"2019-04-14T13:42:47.000Z\",\n           \"updated_at\": \"2019-04-14T13:42:47.000Z\",\n           \"deleted_at\": null\n       }\n   ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"Aucun type de bière trouvé\"\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération des types de bières\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/typeOfBeer.js",
    "groupTitle": "TypeOfBeers",
    "name": "GetTypeofbeersNameName"
  },
  {
    "type": "get",
    "url": "typeOfBeers/:typeOfBeer_id",
    "title": "get type of beer",
    "group": "TypeOfBeers",
    "success": {
      "examples": [
        {
          "title": "HTTP/1.1 200 Success",
          "content": " HTTP/1.1 200 Success\n{\n   \"error\": false,\n   \"message\": {\n       \"id\": 1,\n       \"name\": \"Blonde\",\n       \"created_at\": \"2019-04-14T13:42:47.000Z\",\n       \"updated_at\": \"2019-04-14T13:42:47.000Z\",\n       \"deleted_at\": null\n   }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": \"Le type de bière n'existe pas\"\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la récupération du type de bière\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/typeOfBeer.js",
    "groupTitle": "TypeOfBeers",
    "name": "GetTypeofbeersTypeofbeer_id"
  },
  {
    "type": "post",
    "url": "typeOfBeers/create",
    "title": "add a new type of beer",
    "group": "TypeOfBeers",
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
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"name\": \"Blonde\"\n}",
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
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": \"Erreur lors de la création du type de bière\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/typeOfBeer.js",
    "groupTitle": "TypeOfBeers",
    "name": "PostTypeofbeersCreate"
  },
  {
    "type": "put",
    "url": "typeOfBeers/update/:typeOfBeer_id",
    "title": "update type of beer",
    "group": "TypeOfBeers",
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
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"name\": \"Brune\"\n}",
          "type": "json"
        }
      ]
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
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": message\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/typeOfBeer.js",
    "groupTitle": "TypeOfBeers",
    "name": "PutTypeofbeersUpdateTypeofbeer_id"
  },
  {
    "type": "put",
    "url": "typeOfBeers/upload/:typeOfBeer_id",
    "title": "upload picture typeOfBeer",
    "group": "TypeOfBeers",
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
    "filename": "configs/Routes/typeOfBeer.js",
    "groupTitle": "TypeOfBeers",
    "name": "PutTypeofbeersUploadTypeofbeer_id"
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
          "content": "HTTP/1.1 200 Success\n{\n    \"error\": false,\n    \"message\": [\n          {\n              \"id\": 1,\n              \"email\": \"d.alayrangues@gmail.com\",\n              \"name\": \"dorian\",\n              \"surname\": \"alayrangues\",\n              \"birthDate\": \"1997-05-22T00:00:00.000Z\",\n              \"pathPicture\": null,\n              \"admin\": false,\n              \"created_at\": \"2019-04-14T09:20:46.000Z\",\n              \"updated_at\": \"2019-04-14T09:20:46.000Z\",\n              \"deleted_at\": null,\n              \"typeOfBeer\": [\n                    {\n                        \"id\": 2,\n                        \"name\": \"Brune\",\n                        \"created_at\": \"2019-04-20T09:42:06.000Z\",\n                        \"updated_at\": \"2019-04-20T09:42:06.000Z\",\n                        \"deleted_at\": null,\n                        \"user_typeOfBeer\": {\n                            \"created_at\": \"2019-04-20T09:44:59.000Z\",\n                            \"updated_at\": \"2019-04-20T09:44:59.000Z\",\n                            \"user_id\": 1,\n                            \"type_of_beer_id\": 2\n                        }\n                    },\n                    {\n                        \"id\": 3,\n                        \"name\": \"Blanche\",\n                        \"created_at\": \"2019-04-20T09:42:12.000Z\",\n                        \"updated_at\": \"2019-04-20T09:42:12.000Z\",\n                        \"deleted_at\": null,\n                        \"user_typeOfBeer\": {\n                            \"created_at\": \"2019-04-20T09:45:01.000Z\",\n                            \"updated_at\": \"2019-04-20T09:45:01.000Z\",\n                            \"user_id\": 1,\n                            \"type_of_beer_id\": 3\n                        }\n                    }\n                ]\n          }\n    ]\n}",
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
    "url": "users/establishment/:user_id",
    "title": "get user",
    "group": "Users",
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 Success\n{\n    \"error\": false,\n    \"establishment\": [\n      {\n       \"id\": 1,\n       \"name\": \"Le dernier bar avant la fin du monde 2\",\n       \"gpsLatitude\": 48,\n       \"gpsLongitude\": 2.3461672,\n       \"earlyHappyHours\": \"19:00\",\n       \"lateHappyHours\": \"02:00\",\n       \"description\": \"Coucou\",\n       \"webSiteLink\": \"https://www.facebook.com/?ref=tn_tnmn\",\n       \"facebokLink\": null,\n       \"twitterLink\": null,\n       \"instagramLink\": null,\n       \"created_at\": \"2019-04-27T11:12:52.000Z\",\n       \"updated_at\": \"2019-04-27T11:12:52.000Z\",\n       \"deleted_at\": null,\n       \"user_id\": 1,\n       \"establishment\": \"bar\"\n     }\n   ]\n}",
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
    "name": "GetUsersEstablishmentUser_id"
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
          "content": "HTTP/1.1 200 Success\n{\n    \"error\": false,\n    \"user\": {\n        \"admin\": false,\n        \"id\": 1,\n        \"email\": \"dogui78930@gmail.com\",\n        \"name\": \"dorian\",\n        \"surname\": \"alayrangues\",\n        \"birthDate\": \"1997-05-22T00:00:00.000Z\",\n        \"updated_at\": \"2019-04-14T09:20:46.668Z\",\n        \"created_at\": \"2019-04-14T09:20:46.668Z\",\n        \"typeOfBeer\": [\n                    {\n                        \"id\": 2,\n                        \"name\": \"Brune\",\n                        \"created_at\": \"2019-04-20T09:42:06.000Z\",\n                        \"updated_at\": \"2019-04-20T09:42:06.000Z\",\n                        \"deleted_at\": null,\n                        \"user_typeOfBeer\": {\n                            \"created_at\": \"2019-04-20T09:44:59.000Z\",\n                            \"updated_at\": \"2019-04-20T09:44:59.000Z\",\n                            \"user_id\": 1,\n                            \"type_of_beer_id\": 2\n                        }\n                    },\n                    {\n                        \"id\": 3,\n                        \"name\": \"Blanche\",\n                        \"created_at\": \"2019-04-20T09:42:12.000Z\",\n                        \"updated_at\": \"2019-04-20T09:42:12.000Z\",\n                        \"deleted_at\": null,\n                        \"user_typeOfBeer\": {\n                            \"created_at\": \"2019-04-20T09:45:01.000Z\",\n                            \"updated_at\": \"2019-04-20T09:45:01.000Z\",\n                            \"user_id\": 1,\n                            \"type_of_beer_id\": 3\n                        }\n                    }\n                ]\n    }\n}",
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
  },
  {
    "type": "put",
    "url": "users/:user_id/addBar",
    "title": "add link between type of beer and user",
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
            "field": "bar_id",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"bar_id\": 1\n}",
          "type": "json"
        }
      ]
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
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": message\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/user.js",
    "groupTitle": "Users",
    "name": "PutUsersUser_idAddbar"
  },
  {
    "type": "put",
    "url": "users/:user_id/addBrewery",
    "title": "add link between type of beer and user",
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
            "field": "brewery_id",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"brewery_id\": 1\n}",
          "type": "json"
        }
      ]
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
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": message\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/user.js",
    "groupTitle": "Users",
    "name": "PutUsersUser_idAddbrewery"
  },
  {
    "type": "put",
    "url": "users/:user_id/addTypeOfBeer",
    "title": "add link between type of beer and user",
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
            "field": "typeOfBeer_id",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"typeOfBeer_id\": 1\n}",
          "type": "json"
        }
      ]
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
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": message\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/user.js",
    "groupTitle": "Users",
    "name": "PutUsersUser_idAddtypeofbeer"
  },
  {
    "type": "put",
    "url": "users/:user_id/deleteBar/:bar_id",
    "title": "delete link between type of beer and user",
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
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": message\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/user.js",
    "groupTitle": "Users",
    "name": "PutUsersUser_idDeletebarBar_id"
  },
  {
    "type": "put",
    "url": "users/:user_id/deleteBrewery/:brewery_id",
    "title": "delete link between type of beer and user",
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
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": message\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/user.js",
    "groupTitle": "Users",
    "name": "PutUsersUser_idDeletebreweryBrewery_id"
  },
  {
    "type": "put",
    "url": "users/:user_id/deleteTypeOfBeer/:typeOfBeer_id",
    "title": "delete link between type of beer and user",
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
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 401 Unauthorized\n{\n    \"error\": true,\n    \"message\": message\n}\n\nHTTP/1.1 500 Internal Server Error\n{\n    \"error\": true,\n    \"message\": message\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "configs/Routes/user.js",
    "groupTitle": "Users",
    "name": "PutUsersUser_idDeletetypeofbeerTypeofbeer_id"
  },
  {
    "type": "put",
    "url": "menusBeers/update/:menusBeer_id",
    "title": "update menusBeer",
    "group": "menusBeers",
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
            "field": "price",
            "description": "<p>obligatoire</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n   \"price\": \"10.00\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 Success\n   {\n       \"error\": false\n   }",
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
    "filename": "configs/Routes/menusBeer.js",
    "groupTitle": "menusBeers",
    "name": "PutMenusbeersUpdateMenusbeer_id"
  }
] });
