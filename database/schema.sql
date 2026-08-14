-- =========================================================
-- BASE DE DATOS
-- =========================================================

CREATE DATABASE IF NOT EXISTS gestion_tramites
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE gestion_tramites;


-- =========================================================
-- TABLA: cliente
-- =========================================================

CREATE TABLE cliente (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    tipo_doc ENUM('DNI', 'CE', 'RUC') NOT NULL,

    num_doc VARCHAR(20) NOT NULL,

    nombres VARCHAR(100) NOT NULL,

    ap_paterno VARCHAR(100) NOT NULL,

    ap_materno VARCHAR(100) NULL,

    email VARCHAR(150) NULL,

    telefono VARCHAR(20) NULL,

    fecha_nac DATE NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    -- El número de documento debe ser único
    -- considerando también el tipo de documento.
    UNIQUE KEY uk_cliente_tipo_num_doc (tipo_doc, num_doc),

    -- Validación básica del email
    CONSTRAINT chk_cliente_email
        CHECK (
            email IS NULL
            OR email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'
        )
);


-- =========================================================
-- TABLA: tramite
-- =========================================================

CREATE TABLE tramite (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    -- Ejemplo: INM-2026-0001
    codigo VARCHAR(30) NOT NULL,

    cliente_id INT UNSIGNED NOT NULL,

    placa VARCHAR(10) NULL,

    marca VARCHAR(50) NOT NULL,

    modelo VARCHAR(50) NOT NULL,

    anio INT NOT NULL,

    estado ENUM(
        'REGISTRADO',
        'EN_REVISION',
        'OBSERVADO',
        'APROBADO',
        'RECHAZADO',
        'FINALIZADO'
    ) NOT NULL DEFAULT 'REGISTRADO',

    monto DECIMAL(10,2) NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    -- Código único del trámite
    UNIQUE KEY uk_tramite_codigo (codigo),

    -- Relación con cliente
    CONSTRAINT fk_tramite_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES cliente(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    -- Rango razonable del año
    CONSTRAINT chk_tramite_anio
        CHECK (anio BETWEEN 1990 AND 2027),

    -- El monto no puede ser negativo
    CONSTRAINT chk_tramite_monto
        CHECK (monto IS NULL OR monto >= 0)
);


-- =========================================================
-- TABLA: tramite_seguimiento
-- =========================================================

CREATE TABLE tramite_seguimiento (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    tramite_id INT UNSIGNED NOT NULL,

    estado_anterior VARCHAR(30) NULL,

    estado_nuevo VARCHAR(30) NOT NULL,

    comentario VARCHAR(500) NULL,

    usuario VARCHAR(100) NOT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Relación con trámite
    CONSTRAINT fk_seguimiento_tramite
        FOREIGN KEY (tramite_id)
        REFERENCES tramite(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


-- =========================================================
-- DATOS DE EJEMPLO: CLIENTES
-- =========================================================

INSERT INTO cliente (
    tipo_doc,
    num_doc,
    nombres,
    ap_paterno,
    ap_materno,
    email,
    telefono,
    fecha_nac
) VALUES
(
    'DNI',
    '74859632',
    'Juan Carlos',
    'Pérez',
    'Gómez',
    'juan.perez@gmail.com',
    '987654321',
    '1998-05-15'
),
(
    'DNI',
    '70654321',
    'María Elena',
    'Ramírez',
    'Torres',
    'maria.ramirez@gmail.com',
    '986123456',
    '1995-08-20'
),
(
    'CE',
    '001234567',
    'Carlos Alberto',
    'García',
    'Mendoza',
    'carlos.garcia@gmail.com',
    '985456789',
    '1992-03-10'
),
(
    'RUC',
    '20601234567',
    'Empresa',
    'Servicios',
    'Generales',
    'contacto@serviciosgenerales.com',
    '014567890',
    NULL
);


-- =========================================================
-- DATOS DE EJEMPLO: TRÁMITES
-- =========================================================

INSERT INTO tramite (
    codigo,
    cliente_id,
    placa,
    marca,
    modelo,
    anio,
    estado,
    monto
) VALUES
(
    'INM-2026-0001',
    1,
    'ABC-123',
    'Toyota',
    'Corolla',
    2022,
    'REGISTRADO',
    250.00
),
(
    'INM-2026-0002',
    2,
    NULL,
    'Hyundai',
    'Accent',
    2020,
    'EN_REVISION',
    180.50
),
(
    'INM-2026-0003',
    3,
    'XYZ-789',
    'Kia',
    'Sportage',
    2023,
    'APROBADO',
    350.00
),
(
    'INM-2026-0004',
    4,
    'MNO-456',
    'Nissan',
    'Sentra',
    2019,
    'FINALIZADO',
    420.00
);


-- =========================================================
-- DATOS DE EJEMPLO: SEGUIMIENTO
-- =========================================================

INSERT INTO tramite_seguimiento (
    tramite_id,
    estado_anterior,
    estado_nuevo,
    comentario,
    usuario
) VALUES
(
    1,
    NULL,
    'REGISTRADO',
    'Trámite registrado correctamente.',
    'operador'
),
(
    2,
    NULL,
    'REGISTRADO',
    'Trámite registrado correctamente.',
    'operador'
),
(
    2,
    'REGISTRADO',
    'EN_REVISION',
    'Documentación enviada a revisión.',
    'operador'
),
(
    3,
    NULL,
    'REGISTRADO',
    'Trámite registrado correctamente.',
    'operador'
),
(
    3,
    'REGISTRADO',
    'EN_REVISION',
    'Documentación revisada.',
    'operador'
),
(
    3,
    'EN_REVISION',
    'APROBADO',
    'Trámite aprobado.',
    'supervisor'
),
(
    4,
    NULL,
    'REGISTRADO',
    'Trámite registrado correctamente.',
    'operador'
),
(
    4,
    'REGISTRADO',
    'EN_REVISION',
    'Documentación en revisión.',
    'operador'
),
(
    4,
    'EN_REVISION',
    'APROBADO',
    'Trámite aprobado.',
    'supervisor'
),
(
    4,
    'APROBADO',
    'FINALIZADO',
    'Trámite finalizado correctamente.',
    'operador'
);