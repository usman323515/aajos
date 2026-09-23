-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('SMARTPHONE', 'POWER_BANK');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('OWNER', 'STAFF');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'STAFF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "category" "ProductCategory" NOT NULL DEFAULT 'SMARTPHONE',
    "model" TEXT NOT NULL,
    "shortDesc" TEXT NOT NULL,
    "fullDesc" TEXT NOT NULL,
    "ram" TEXT,
    "storage" TEXT,
    "color" TEXT,
    "specs" TEXT,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "easyBuy" BOOLEAN NOT NULL DEFAULT false,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "category" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessSettings" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "businessName" TEXT NOT NULL DEFAULT 'A,A JOS COMM',
    "ceoName" TEXT NOT NULL DEFAULT 'Abdurrahman Muhammad Al Amin',
    "ceoPublicName" TEXT NOT NULL DEFAULT 'Abdul Jos',
    "phone" TEXT NOT NULL DEFAULT '07036854747',
    "whatsapp" TEXT NOT NULL DEFAULT '07036854747',
    "addressLine1" TEXT NOT NULL DEFAULT 'A,A JOS COMM Shop',
    "addressLine2" TEXT NOT NULL DEFAULT 'Opposite Sangami',
    "city" TEXT NOT NULL DEFAULT 'Pantami, Gombe',
    "country" TEXT NOT NULL DEFAULT 'Nigeria',
    "mapUrl" TEXT,
    "openingTime" TEXT NOT NULL DEFAULT '8:00 AM',
    "closingTime" TEXT NOT NULL DEFAULT '8:00 PM',
    "tiktokUrl" TEXT DEFAULT 'https://www.tiktok.com/@abduljos48?_r=1&_t=ZS-99rq6Hhgbqf',
    "facebookUrl" TEXT DEFAULT 'https://www.facebook.com/abdul.jos.37',
    "shopVideoUrl" TEXT DEFAULT 'https://youtube.com/shorts/jAYhDnpf-ms?si=_CI4i9aB3kmoX0J7',
    "moniepointAccountNumber" TEXT DEFAULT '8246451928',
    "moniepointAccountName" TEXT DEFAULT 'Abdul Jos Enterprises',
    "opayAccountNumber" TEXT DEFAULT '7036854747',
    "opayAccountName" TEXT DEFAULT 'Abdurrahman Muhammad Al Amin',
    "easyBuyDescription" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_slug_key" ON "Brand"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_brandId_idx" ON "Product"("brandId");

-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");

-- CreateIndex
CREATE INDEX "Product_featured_idx" ON "Product"("featured");

-- CreateIndex
CREATE INDEX "Product_visible_idx" ON "Product"("visible");

-- CreateIndex
CREATE INDEX "ProductImage_productId_idx" ON "ProductImage"("productId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
