# Acds

Acds est un outil dédié à l'assistant chef de salle. 

Ceci est la partie "Back-end" basée sur Express-MongoDB


## Prerequis

Installation et lancement du service mongodb

Sous linux:

```
sudo service mongod start
```

## Installation:

seulement pour windows : npm install -g win-node-env

```
npm install
```

## Lancement :

```
npm start
```

Surveillance base de données:

On peut inspecter la base de donnée via MongoDb compass 

connect to => mongodb://localhost:27017
    
## Librairies utilisées

* body-parser: ^1.19.0
* cors: ^2.8.5
* express: ^4.17.1
* express-winston: 4.0.3
* mongoose: 5.9.1
* socket.io: 2.3.0
* uuid: 8.1.0
* winston: 3.2.1

cors: surtout pour le developpement en local, pour des requêtes normalement bloquées sur localhost.
socket.io: pour l'etablissement d'une communication bilatérale entre le front-end et le back-end.

L'installation dans les dev-dependencies de nodemon permet aussi le redemarrage du serveur des lors qu'il y a une modification.

* nodemon: ^2.0.4

### Serveur https

Pour disposer des API mobile il faut que le front-end soit hebergé sur un serveur HTTPS, donc le back-end doit l'etre aussi.

On peut débuter par l'utilisation d'un certification autosigné par openssl.

Mais cela ne suffit pas et une solution consiste a obtenir un certificat par cerbot/letsencrypt (il faut disposer d'un nom de domaine)


Voir :

https://itnext.io/node-express-letsencrypt-generate-a-free-ssl-certificate-and-run-an-https-server-in-5-minutes-a730fbe528ca

### Docker

#### Installation 

https://docs.docker.com/engine/install/debian/
compose :
https://www.digitalocean.com/community/tutorials/how-to-install-docker-compose-on-debian-10-fr
Sans sudo:
https://ubuntuplace.info/questions/1551/comment-utiliser-docker-sans-sudo

#### DockerFile (pour information) 

On peut commencer par l'écriture d'un dockerfile :

Build du dockerfile (pour info) 
docker build -t repo/server:1 .

#### Commande intéressantes 

docker image ls
docker tag bruno/acds-back:1 d06138159c94 (id de l'image)
docker run -it --name acds-back -p 3040:3040 bruno/acds-back:1

docker ps (pour voir les containers actif)
docker ps -a pour voir les containers arrétés
docker rm nom_container (ici acds-back)
on peut aussi faire des docker (re)start-stop nom_container
(docker events)

!!! si docker image ls donne 

REPOSITORY                    TAG                 IMAGE ID            CREATED             SIZE
bruno/acds-back               1                   d06138159c94        20 hours ago        117MB

Alors le nom de l'image est bruno/acds-back:1

Cette approche a permis dans un premier temps de tester un docker basé sur une image node dans laquelle on lance le code du bac-end 

On peut par la suite faire une composition avec deux container le précédent et un nouveau qui est basé sur une image mongodb

#### docker-compose.yml

Pour installer le serveur il faut lancer:

docker-compose up (-d pour rendre la main)
mongodb is up-to-date
Starting acds-back ... done

Le serveur est pret!

Il ne manque que la partie reverse-proxy permettant la gestion des certificats ssl


#### nginx

sudo apt-get install nginx
les deux fichiers boissiebruno-pageperso-pi.ovh correspondent à des configuration du serveur nginx.

