import pool from "../db.js";
export const joinedTables = async () => {
	const result = await pool.query(`
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
        `);
	return result.rows;
}

export const joinedTablesToEdit = async (id) => {
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
                WHERE t."taskId" = $1
                `, [id]);
    return result.rows;
}
