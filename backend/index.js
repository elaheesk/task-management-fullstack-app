import express from 'express';
import cors from "cors";
import pool from "./db.js";
import fs from "fs";
import path from "path";
import multer from "multer";
import { joinedTables, joinedTablesToEdit } from "./controllers/taskController.js";

const app = express();
app.use(cors());
app.use(express.json());


app.get("/postgres", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()"); // Query to get the current timestamp
        res.json(result.rows[0]); // Send the result as JSON
    } catch (err) {
        res.status(500).send("Error connecting to the database");
    }
});
app.get("/", (req, res) => {
    res.send("heeej");
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, "uploadedFiles/") },
    filename: (req, file, cb) => { cb(null, `${Date.now()}-${file.originalname}`) },
})
const uploadStorage = multer({ storage });

app.post("/tasks", uploadStorage.single("file"), async (req, res) => {

    const { taskName, date, ranktask, tagId } = req.body;

    try {
        await pool.query(
            'INSERT INTO tasks ("taskName", "date","ranktask","tagId") VALUES ($1, $2, $3, $4)',
            [taskName, date, ranktask, tagId]
        );
        const resultsFromTaks = await pool.query('SELECT * FROM tasks ORDER BY "taskId" ASC');

        if (req.file) {
            const taskId = resultsFromTaks.rows[resultsFromTaks.rows.length - 1].taskId;
            const filePath = req.file.path;
            const fileName = req.file.originalname;
            const fileType = req.file.mimetype;
            const fileSize = req.file.size;

            await pool.query(
                'INSERT INTO task_files ("taskid","filepath", "filename","filetype","filesize") VALUES ($1, $2, $3, $4, $5)',
                [taskId, filePath, fileName, fileType, fileSize]
            );

        }
        const result = await joinedTables();

        res.status(200).json(result);

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});


app.put("/tasks", uploadStorage.single("file"), async (req, res) => {
    const { taskName, date, ranktask, taskId, tagId, removeFile } = req.body;

    try {
        const foundFile = await pool.query('SELECT * FROM task_files WHERE "taskid" = $1 ', [taskId]);
        const existingFile = foundFile.rows[0];
    
        if (removeFile === "true" && existingFile) {

            if (fs.existsSync(existingFile.filepath)) { //Remove from Storage
                fs.unlinkSync(existingFile.filepath);
            }
            await pool.query('DELETE FROM task_files WHERE "taskid"= $1', [taskId])
        }
        if (req.file) {
            if (existingFile) {
              
                if (fs.existsSync(existingFile.filepath)) { //Remove from Storage
                    fs.unlinkSync(existingFile.filepath);
                }

                await pool.query(
                    'UPDATE task_files SET "filepath" = $1, "filename" = $2, "filetype" = $3, "filesize" = $4 WHERE "taskid" = $5',
                    [req.file.path, req.file.originalname, req.file.mimetype, req.file.size, taskId]
                );

            } else {
                await pool.query(
                    'INSERT INTO task_files ("taskid","filepath", "filename","filetype","filesize") VALUES ($1, $2, $3, $4, $5)',
                    [taskId, req.file.path, req.file.originalname, req.file.mimetype, req.file.size]
                );
            }
        }

        await pool.query(
            'UPDATE tasks SET "taskName" = $1, "date" = $2 , "ranktask" = $3 , "tagId" = $4 WHERE "taskId" = $5',
            [taskName, date, ranktask, tagId, taskId]
        );
 
        const result = await joinedTables();

        res.status(200).json(result);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});


app.get('/tasks', async (req, res) => {
    const search = req.query.taskName;

    if (search) {
        try {

            const result = await pool.query(
                `
                SELECT  
                    t."taskId",  
                    t."taskName",  
                    t."date",  
                    t."ranktask",  
                    t."tagId", 
                    tf."filepath",
                    tf."filename",
                    tf."filetype",
                    tf."filesize"
                FROM tasks t
                LEFT JOIN task_files tf
                ON t."taskId" = tf."taskid"
                WHERE LOWER(t."taskName") LIKE LOWER($1 || '%')
                `,
                [search]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: `No tasks found starting with "${search}"` });
            }

            return res.status(200).json(result.rows);

        } catch (error) { return res.status(500).json({ error: "Internal Server Error" }); }

    } else {
        await pool.query(`
            SELECT 
                t."taskId", 
                t."taskName", 
                t."date", 
                t."ranktask", 
                t."tagId",
                tf."filepath",
                tf."filename",
                tf."filetype",
                tf."filesize"
            FROM tasks t
            LEFT JOIN task_files tf
            ON t."taskId" = tf."taskid"
            ORDER BY t."taskId" ASC
        `, (error, results) => {
            if (error) {
                return res.status(500).json({ error: "Internal Server Error" });
            }
            res.status(200).json(results.rows);
        });
    }
});


app.get('/tasks/tags', async (req, res) => {
    const checkboxValue = req.query.tagId;
    console.log("checkboxvalue is:::", checkboxValue)
    try {
        const result = await pool.query(
            'SELECT * FROM tasks WHERE "tagId" = $1',
            [`${checkboxValue}`]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: `No tasks found with tagId ${checkboxValue}` });
        }
        return res.status(200).json(result.rows);
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


app.get("/tasks/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const result = await joinedTablesToEdit(id);
        if (result.length === 0) {
            return res.status(404).json({ error: `Task with ID ${id} not found` });
        }
        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});




app.delete("/tasks/:id", async (req, res) => { //delete from the child table first, child table has foreign key. if you delete from parent table first it will levave orphaned records in child table (task_files) 
    const id = req.params.id;
    try {
        const taskWithFile = await pool.query('SELECT "filepath" FROM task_files WHERE "taskid" = $1', [id]);

        if (taskWithFile.rowCount > 0) {

            var filePath = taskWithFile.rows[0].filepath;

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Failed to delete file at ${filePath}:`, err);
                } else {
                    console.log(`File deleted at ${filePath}`);
                }
            });

        }
        await pool.query('DELETE FROM task_files WHERE "taskid" = $1 ', [id])

        const taskResult = pool.query('DELETE FROM tasks WHERE "taskId" = $1', [id])

        if (taskResult.rowCount === 0) {
            return res.status(404).json({ error: `Task with ID ${id} not found` });
        }

        res.status(200).json({ message: "Task and associated files deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
})

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
