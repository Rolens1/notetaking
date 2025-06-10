// test/notes.api.test.js

const chai = require('chai');
const request = require('supertest');
const app = require('../backend/app');
const Note = require('../backend/models/noteSchema'); 

const expect = chai.expect;


describe('Notes API', () => {

    afterEach(async () => {
        await Note.deleteMany({});
    });

    //  Test suite for POST /api/create/note 
    describe('POST /api/create/note', () => {

        // Test case 1: Successful creation with an existing category
        it('should create a new note with an existing category', (done) => {
            const noteData = {
                title: 'My work presentation',
                content: 'Prepare slides for the meeting.',
                category: 'Work'
            };

            request(app)
                .post('/api/create/note')
                .send(noteData)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.body.success).to.equal(true);
                    expect(res.body.data.note).to.be.an('object');
                    expect(res.body.data.note).to.have.property('title', noteData.title);
                    expect(res.body.data.note).to.have.property('category', 'Work'); // On vérifie que la catégorie est bien 'Work'
                    expect(res.body.data.note).to.have.property('renderedContent'); // On vérifie que le HTML est bien généré
                    
                    done();
                });
        });

        // Test case 2: Successful creation with a NEW category
        it('should create a new note and use the new_category_name', (done) => {
            const noteData = {
                title: 'New project ideas',
                content: 'Brainstorming for the Q3 project.',
                category: 'new',
                new_category_name: 'Q3 Project'
            };

            request(app)
                .post('/api/create/note')
                .send(noteData)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    
                    expect(res.body.success).to.equal(true);
                    expect(res.body.data.note).to.have.property('category', 'Q3 Project'); // On vérifie que la catégorie est bien le nouveau nom
                    
                    done();
                });
        });

        // Test case 3: Failure when title is missing
        it('should return a 400 error if title is missing', (done) => {
            const invalidNote = {
                content: 'This note has no title',
                category: 'Work'
            };

            request(app)
                .post('/api/create/note')
                .send(invalidNote)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    
                    expect(res.body).to.have.property('error', 'Title and content are required');
                    
                    done();
                });
        });

    });

});