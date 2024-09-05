import express from "express";
import cors from "cors";
import { db } from "../database/connection.js";
import fileUpload from "express-fileupload";
import { routerRole } from "../routes/role.js";
import { routerUser } from "../routes/user.js";
import { routerCollaborator } from "../routes/collaborator.js";
import { routerCountInventory } from "../routes/countInventory.js";
import { routerComInventory } from "../routes/comInventory.js";
import { routerThInventory } from "../routes/thInventory.js";
import { routerAuth } from "../routes/auth.js";
import { routerCountReport } from "../routes/countReport.js";
import { routerComReport } from "../routes/comReport.js";
import { routerThReport } from "../routes/thReport.js";
import { routerArea } from "../routes/area.js";
import { routerPost } from "../routes/post.js";

const whiteList = ['http://localhost:3000', 'https://inventrack.micoopecoban.com']; // Añade aquí el dominio de tu aplicación cliente
const corsOptions = {
    origin: function (origin, callback) {
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.rolePath = '/api/role';
        this.userPath = '/api/user';
        this.authPath = '/api/auth';
        this.collaboratorPath = '/api/collaborator';
        this.countInventoryPath = '/api/countInventory';
        this.comInventoryPath = '/api/comInventory';
        this.thInventoryPath = '/api/thInventory';
        this.countReportPath = '/api/countReport';
        this.comReportPath = '/api/comReport';
        this.thReportPath = '/api/thReport';
        this.areaPath = '/api/area';
        this.postPath = '/api/post';
     
        this.dbConnection();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        // CORS
        this.app.use(cors(corsOptions));
        // Lectura y parseo del body
        this.app.use(express.json());
        // Directorio público
        this.app.use(express.static('public'));
        // Subida de archivos al servidor
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/'
        }));
    }

    async dbConnection() {
        try {
            await db.authenticate();
            console.log('DB online');
        } catch (error) {
            throw new Error(error);
        }
    }

    routes() {
        this.app.use(this.rolePath, routerRole);
        this.app.use(this.userPath, routerUser);
        this.app.use(this.authPath, routerAuth);
        this.app.use(this.collaboratorPath, routerCollaborator);
        this.app.use(this.countInventoryPath, routerCountInventory);
        this.app.use(this.comInventoryPath, routerComInventory);
        this.app.use(this.thInventoryPath, routerThInventory);
        this.app.use(this.countReportPath, routerCountReport);
        this.app.use(this.comReportPath, routerComReport);
        this.app.use(this.thReportPath, routerThReport);
        this.app.use(this.areaPath, routerArea);
        this.app.use(this.postPath, routerPost);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto http://localhost:${this.port}`);
        });
    }
}

export { Server };