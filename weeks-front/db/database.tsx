import { openDatabaseSync } from "expo-sqlite";
import { Schedule } from "@/types/schedule";
const db = openDatabaseSync("app.db");

const appDB = {
    sp_CreateScheduleTable: async () => {
        await db.withTransactionAsync(async () => {
            await db.runAsync(`
                CREATE TABLE IF NOT EXISTS tbl_Schedules(
                uuid        BIGINT PRIMARY KEY NOT NULL,
                circle_uid  BIGINT NOT NULL,
                user_uid    BIGINT NOT NULL,
                type        INTEGER NOT NULL,
                title       TEXT NOT NULL,
                content     TEXT NOT NULL,
                start_time  DATETIME NOT NULL,
                end_time    DATETIME NOT NULL,
                updated_time DATETIME NOT NULL,
                status      INTEGER DEFAULT 0
                );
            `);
            await db.runAsync(`
                CREATE INDEX IF NOT EXISTS idx_schedules_time
                ON tbl_Schedules(start_time, end_time);
            `);
        });
    },

    sp_SeedDataInsert: async () => {
        // 기존 데이터 삭제 후 새 데이터 삽입 (개발 중에만)
        await db.runAsync("DELETE FROM tbl_Schedules");
        
        const now = new Date();
        const today = now.toISOString().split('T')[0]; // YYYY-MM-DD 형식
        console.log('Inserting test data for date:', today);
        
        await db.runAsync(`
            INSERT INTO tbl_Schedules (uuid, circle_uid, user_uid, type, title, content, start_time, end_time, updated_time, status) VALUES (?,?,?,?,?,?,?,?,?,?)`,
            [String(Date.now()), 0, 1, 0, "테스트 할 일 입니다.", "테스트 할 일의 내용입니다.", `${today} 09:00:00`, `${today} 13:00:00`, now.toISOString(), 0]
        );
    },

    sp_CreateSchedule: async (circle_uid: number, user_uid: number, type: number, title: string, content: string, startTs: number, endTs: number) => {
        await db.runAsync(
            "INSERT INTO tbl_Schedules (uuid, circle_uid, user_uid, type, title, content, start_time, end_time, updated_time, status) VALUES (?,?,?,?,?,?,?,?,?,?)",
            [String(Date.now()), circle_uid, user_uid, type, title, content, new Date(startTs).toISOString(), new Date(endTs).toISOString(), new Date().toISOString(), 0]
        );
    },

    sp_GetSchedules: async () => {
        const userSchedules = await db.getAllAsync("SELECT * FROM tbl_Schedules ORDER BY start_time ASC");
        const schedules : Schedule[] = userSchedules.map((schedule: any) => ({
          UUID: String(schedule.uuid),
          CircleUID: String(schedule.circle_uid),
          UserUID: String(schedule.user_uid),
          Type: schedule.type,
          Title: schedule.title,
          Content: schedule.content,
          StartTime: new Date(schedule.start_time),
          EndTime: new Date(schedule.end_time),
          UpdateTime: new Date(schedule.updated_time),
          Status: schedule.status
        }));
        return schedules;
    },

    sp_UpdateSchedule: async (id: string, title: string, content: string, startTs: number, endTs: number) => {
        await db.runAsync(
            "UPDATE tbl_Schedules SET title=?, content=?, start_time=?, end_time=?, updated_time=? WHERE uuid=?",
            [title, content, new Date(startTs).toISOString(), new Date(endTs).toISOString(), new Date().toISOString(), id]
        );
    },

    sp_DeleteSchedule: async (id: string) => {
        await db.runAsync(
            "UPDATE tbl_Schedules SET status=9 WHERE uuid=?",
            [id]
        );
    },

    sp_ClearAllSchedules: async () => {
        await db.runAsync("DELETE FROM tbl_Schedules");
    },
}

export default appDB;