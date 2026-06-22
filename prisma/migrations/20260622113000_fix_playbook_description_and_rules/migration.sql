-- AlterTable
ALTER TABLE "Playbook" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Playbook" ALTER COLUMN "rules" SET DATA TYPE JSONB;
