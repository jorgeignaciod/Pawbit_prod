-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('RUT', 'DNI');

-- CreateEnum
CREATE TYPE "PetSpecies" AS ENUM ('PERRO', 'GATO');

-- CreateEnum
CREATE TYPE "PetSex" AS ENUM ('MACHO', 'HEMBRA');

-- CreateEnum
CREATE TYPE "MedicalRecordType" AS ENUM ('VACUNA', 'CONSULTA', 'ALERGIA', 'DIAGNOSTICO', 'TRATAMIENTO', 'PESO', 'NOTA');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('VACUNA', 'CONTROL', 'RECORDATORIO', 'MEDICAMENTO');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('PENDIENTE', 'COMPLETADO', 'ATENCION', 'CANCELADO');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('VACUNA', 'CONTROL', 'RECORDATORIO', 'MEDICAMENTO', 'SISTEMA');

-- CreateEnum
CREATE TYPE "NotificationPriority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "ReminderChannel" AS ENUM ('PUSH', 'EMAIL', 'IN_APP');

-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'CANCELLED');

-- CreateSequence
CREATE SEQUENCE "User_id_seq" START WITH 100 INCREMENT BY 1 MINVALUE 100;

-- CreateSequence
CREATE SEQUENCE "Session_id_seq" START WITH 100 INCREMENT BY 1 MINVALUE 100;

-- CreateSequence
CREATE SEQUENCE "Pet_id_seq" START WITH 100 INCREMENT BY 1 MINVALUE 100;

-- CreateSequence
CREATE SEQUENCE "MedicalRecord_id_seq" START WITH 100 INCREMENT BY 1 MINVALUE 100;

-- CreateSequence
CREATE SEQUENCE "RecordAttachment_id_seq" START WITH 100 INCREMENT BY 1 MINVALUE 100;

-- CreateSequence
CREATE SEQUENCE "Event_id_seq" START WITH 100 INCREMENT BY 1 MINVALUE 100;

-- CreateSequence
CREATE SEQUENCE "EventReminder_id_seq" START WITH 100 INCREMENT BY 1 MINVALUE 100;

-- CreateSequence
CREATE SEQUENCE "Notification_id_seq" START WITH 100 INCREMENT BY 1 MINVALUE 100;

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL DEFAULT nextval('"User_id_seq"'),
    "token" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "documentType" "DocumentType" NOT NULL DEFAULT 'RUT',
    "documentNumber" TEXT NOT NULL DEFAULT '',
    "avatar" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" INTEGER NOT NULL DEFAULT nextval('"Session_id_seq"'),
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pet" (
    "id" INTEGER NOT NULL DEFAULT nextval('"Pet_id_seq"'),
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "species" "PetSpecies" NOT NULL,
    "breed" TEXT NOT NULL,
    "sex" "PetSex" NOT NULL,
    "birthDate" TIMESTAMP(3),
    "weightCurrent" DOUBLE PRECISION,
    "color" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "isNeutered" BOOLEAN NOT NULL DEFAULT false,
    "microchipNumber" TEXT,
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalRecord" (
    "id" INTEGER NOT NULL DEFAULT nextval('"MedicalRecord_id_seq"'),
    "token" TEXT NOT NULL,
    "petId" INTEGER NOT NULL,
    "type" "MedicalRecordType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "vetName" TEXT,
    "nextDueDate" TIMESTAMP(3),
    "metadata" JSONB,
    "createdByUserId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecordAttachment" (
    "id" INTEGER NOT NULL DEFAULT nextval('"RecordAttachment_id_seq"'),
    "token" TEXT NOT NULL,
    "recordId" INTEGER NOT NULL,
    "storageKey" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecordAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL DEFAULT nextval('"Event_id_seq"'),
    "token" TEXT NOT NULL,
    "petId" INTEGER NOT NULL,
    "sourceRecordId" INTEGER,
    "type" "EventType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3),
    "status" "EventStatus" NOT NULL DEFAULT 'PENDIENTE',
    "location" TEXT,
    "metadata" JSONB,
    "createdByUserId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventReminder" (
    "id" INTEGER NOT NULL DEFAULT nextval('"EventReminder_id_seq"'),
    "token" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,
    "channel" "ReminderChannel" NOT NULL,
    "offsetMinutes" INTEGER NOT NULL,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "sentAt" TIMESTAMP(3),
    "status" "ReminderStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventReminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" INTEGER NOT NULL DEFAULT nextval('"Notification_id_seq"'),
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "petId" INTEGER,
    "eventId" INTEGER,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "priority" "NotificationPriority" NOT NULL DEFAULT 'MEDIUM',
    "readAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "actionUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_token_key" ON "User"("token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Pet_token_key" ON "Pet"("token");

-- CreateIndex
CREATE INDEX "Pet_userId_idx" ON "Pet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalRecord_token_key" ON "MedicalRecord"("token");

-- CreateIndex
CREATE INDEX "MedicalRecord_petId_recordedAt_idx" ON "MedicalRecord"("petId", "recordedAt" DESC);

-- CreateIndex
CREATE INDEX "MedicalRecord_createdByUserId_idx" ON "MedicalRecord"("createdByUserId");

-- CreateIndex
CREATE UNIQUE INDEX "RecordAttachment_token_key" ON "RecordAttachment"("token");

-- CreateIndex
CREATE INDEX "RecordAttachment_recordId_idx" ON "RecordAttachment"("recordId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_token_key" ON "Event"("token");

-- CreateIndex
CREATE INDEX "Event_petId_startAt_idx" ON "Event"("petId", "startAt");

-- CreateIndex
CREATE INDEX "Event_createdByUserId_idx" ON "Event"("createdByUserId");

-- CreateIndex
CREATE UNIQUE INDEX "EventReminder_token_key" ON "EventReminder"("token");

-- CreateIndex
CREATE INDEX "EventReminder_eventId_idx" ON "EventReminder"("eventId");

-- CreateIndex
CREATE INDEX "EventReminder_status_scheduledFor_idx" ON "EventReminder"("status", "scheduledFor");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_token_key" ON "Notification"("token");

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Notification_petId_idx" ON "Notification"("petId");

-- CreateIndex
CREATE INDEX "Notification_eventId_idx" ON "Notification"("eventId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordAttachment" ADD CONSTRAINT "RecordAttachment_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "MedicalRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_sourceRecordId_fkey" FOREIGN KEY ("sourceRecordId") REFERENCES "MedicalRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventReminder" ADD CONSTRAINT "EventReminder_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
