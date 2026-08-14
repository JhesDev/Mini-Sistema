-- =========================================================
-- BASE DE DATOS
-- =========================================================

CREATE DATABASE IF NOT EXISTS gestion_tramites
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE gestion_tramites;

-- Re-ejecución segura
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS tramite_seguimiento;
DROP TABLE IF EXISTS tramite;
DROP TABLE IF EXISTS cliente;
SET FOREIGN_KEY_CHECKS = 1;

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
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_cliente_tipo_num_doc (tipo_doc, num_doc)
);

-- =========================================================
-- TABLA: tramite
-- =========================================================

CREATE TABLE tramite (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
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
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_tramite_codigo (codigo),
  KEY idx_tramite_cliente_id (cliente_id),
  KEY idx_tramite_estado (estado),
  CONSTRAINT fk_tramite_cliente
    FOREIGN KEY (cliente_id)
    REFERENCES cliente(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
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
  KEY idx_seguimiento_tramite_id (tramite_id),
  KEY idx_seguimiento_estado_nuevo (estado_nuevo),
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
('DNI', '74859632', 'Juan Carlos', 'Perez', 'Gomez', 'juan.perez@gmail.com', '987654321', '1998-05-15'),
('DNI', '70654321', 'Maria Elena', 'Ramirez', 'Torres', 'maria.ramirez@gmail.com', '986123456', '1995-08-20'),
('CE', '001234567', 'Carlos Alberto', 'Garcia', 'Mendoza', 'carlos.garcia@gmail.com', '985456789', '1992-03-10'),
('RUC', '20601234567', 'Empresa', 'Servicios', 'Generales', 'contacto@serviciosgenerales.com', '014567890', NULL);

-- =========================================================
-- DATOS DE EJEMPLO: TRAMITES
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
('INM-2026-0001', 1, 'ABC-123', 'Toyota', 'Corolla', 2022, 'REGISTRADO', 250.00),
('INM-2026-0002', 2, NULL, 'Hyundai', 'Accent', 2020, 'EN_REVISION', 180.50),
('INM-2026-0003', 3, 'XYZ-789', 'Kia', 'Sportage', 2023, 'APROBADO', 350.00),
('INM-2026-0004', 4, 'MNO-456', 'Nissan', 'Sentra', 2019, 'FINALIZADO', 420.00),
('INM-2026-0005', 1, NULL, 'Mazda', 'CX-5', 2024, 'OBSERVADO', 510.00),
('INM-2026-0006', 2, 'QWE-321', 'Chevrolet', 'Onix', 2021, 'RECHAZADO', 120.00);

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
(1, NULL, 'REGISTRADO', 'Tramite registrado correctamente.', 'operador'),
(2, NULL, 'REGISTRADO', 'Tramite registrado correctamente.', 'operador'),
(2, 'REGISTRADO', 'EN_REVISION', 'Documentacion enviada a revision.', 'operador'),
(3, NULL, 'REGISTRADO', 'Tramite registrado correctamente.', 'operador'),
(3, 'REGISTRADO', 'EN_REVISION', 'Documentacion revisada.', 'operador'),
(3, 'EN_REVISION', 'APROBADO', 'Tramite aprobado.', 'supervisor'),
(4, NULL, 'REGISTRADO', 'Tramite registrado correctamente.', 'operador'),
(4, 'REGISTRADO', 'EN_REVISION', 'Documentacion en revision.', 'operador'),
(4, 'EN_REVISION', 'APROBADO', 'Tramite aprobado.', 'supervisor'),
(4, 'APROBADO', 'FINALIZADO', 'Tramite finalizado correctamente.', 'operador'),
(5, NULL, 'REGISTRADO', 'Tramite registrado correctamente.', 'operador'),
(5, 'REGISTRADO', 'EN_REVISION', 'Se detecto observacion en documentos adjuntos.', 'operador'),
(5, 'EN_REVISION', 'OBSERVADO', 'Pendiente de subsanacion del cliente.', 'supervisor'),
(6, NULL, 'REGISTRADO', 'Tramite registrado correctamente.', 'operador'),
(6, 'REGISTRADO', 'EN_REVISION', 'Documentacion revisada.', 'operador'),
(6, 'EN_REVISION', 'RECHAZADO', 'No cumple requisitos minimos del proceso.', 'supervisor');
