import express from 'express';
import { IsAuthenticated } from '../helpers/auth.js'

export function CatsRouter(mod_db) {

    // We create and return this object that contains all the routes we set up right here, hence using "router.get" and not "app.get".
    // Let's us segreagate route code into different files based on type.
    const router = express.Router();

    router.get('/', async (req, res) => {
        // console.log(`Home page res.locals:`, res.locals);

        const randBreed = await mod_db.GetRandomBreed();
        // console.log(randBreed);
        const randFact = await mod_db.GetRandomFact();
        // console.log(randFact);
    
        res.render('home', {
            head: {
                title: "Home"
            },
            body: {
                randBreed,
                randFact,
                user: res.locals.user
            }            
        });
    });

    router.get('/breeds', IsAuthenticated, async (req, res) => {
  
        const catBreeds = await mod_db.GetBreeds();
        // console.log(catBreeds);
      
        res.render('breeds', {
            head: {
                title: "Breeds"
            },
            body: {
                docArr_Breeds: catBreeds,
                user: res.locals.user
            }            
        });
    });
    
    router.get('/breeds/:breedId', IsAuthenticated, async (req, res) => {
        const isValidId = await mod_db.IsObjectId(req.params.breedId);
        console.log(`Reached cat breeds by id route <${req.params.breedId}>, is valid object id <${isValidId}>`);
    
        // x By some magic I cannot begin to fathom, this route will randomly be called with the breedId = "main.css" or "main.js". I haven't the slightest clue why.
        // x This is also causing the client to not have access to those files.
        if(!isValidId) {
            res.end();
            return;
        }
    
        const catBreed = await mod_db.GetBreed(req.params.breedId);
        // console.log(catBreed);
      
        res.render('breed', {
            head: {
                title: `Breed: ${catBreed['breed']}`
            },
            body: {
                doc_Breed: catBreed,
                user: res.locals.user
            }            
        });
    });
    
    router.get('/facts', async (req, res) => {
    
        const catFacts = await mod_db.GetFacts();
        // console.log(catFacts);
    
        res.render('facts', {
            head: {
                title: "Facts"
            },
            body: {
                docArr_Facts: catFacts,
                user: res.locals.user
            }            
        });
    });
    
    router.get('/facts/:factId', async (req, res) => {
        const isValidId = await mod_db.IsObjectId(req.params.factId);
        console.log(`Reached cat breeds by id route <${req.params.factId}>, is valid object id <${isValidId}>`);
    
        // x By some magic I cannot begin to fathom, this route will randomly be called with the factId = "main.css" or "main.js". I haven't the slightest clue why.
        // x This is also causing the client to not have access to those files.
        if(!isValidId) {
            res.end();
            return;
        }
    
        const catFact = await mod_db.GetFact(req.params.factId);
        // console.log(catFact);
      
        res.render('fact', {
            head: {
                title: `Fact`
            },
            body: {
                doc_Fact: catFact,
                user: res.locals.user
            }            
        });
    });

    return router;
}