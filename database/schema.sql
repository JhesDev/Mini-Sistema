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
DROP TABLE IF EXISTS users;
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
-- TABLA: users (Autenticación)
-- =========================================================

CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(150) NOT NULL,
  password VARCHAR(255) NOT NULL,
  nombre_completo VARCHAR(150) NOT NULL,
  rol ENUM('ADMIN', 'OPERADOR', 'SUPERVISOR') NOT NULL DEFAULT 'OPERADOR',
  activo TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_users_username (username),
  UNIQUE KEY uk_users_email (email)
);

-- =========================================================
-- DATOS DE EJEMPLO: USUARIOS (Contraseña default: <usuario>123)
-- admin: admin123 | operador: operador123 | supervisor: supervisor123
-- =========================================================

INSERT INTO users (
  username,
  email,
  password,
  nombre_completo,
  rol,
  activo
) VALUES
('admin', 'admin@sistema.local', '$2b$10$ewVK5AkuNkIOMFvIb0/qou6fQbiV0d3kayjaiZbH6RDIBDJMnOpk2', 'Administrador del Sistema', 'ADMIN', 1),
('operador', 'operador@sistema.local', '$2b$10$P8bzw9XwSmIfy218jh1tjeYU2FTnDsodo9XYooqV/Dcrn5rX08LwK', 'Operador Principal', 'OPERADOR', 1),
('supervisor', 'supervisor@sistema.local', '$2b$10$T8Lo4/gegaakCWeNMKR67u8nI0AXahd.NTTCLuJqHHe1oKC52yy3.', 'Supervisor General', 'SUPERVISOR', 1);

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
('INM-2026-0005', 1, 'PQR-101', 'Toyota', 'Yaris', 2021, 'EN_REVISION', 220.00),
('INM-2026-0006', 2, NULL, 'Kia', 'Rio', 2020, 'REGISTRADO', 175.50),

('INM-2026-0007', 3, 'LMN-234', 'Hyundai', 'Tucson', 2022, 'APROBADO', 310.00),
('INM-2026-0008', 4, 'BCD-345', 'Nissan', 'Versa', 2019, 'RECHAZADO', 200.00),
('INM-2026-0009', 1, 'EFG-456', 'Chevrolet', 'Onix', 2023, 'FINALIZADO', 450.00),
('INM-2026-0010', 2, 'HIJ-567', 'Toyota', 'Corolla', 2020, 'APROBADO', 280.00),

('INM-2026-0011', 3, NULL, 'Mazda', 'CX-5', 2021, 'REGISTRADO', 195.00),
('INM-2026-0012', 4, 'KLM-789', 'Ford', 'Ranger', 2022, 'EN_REVISION', 325.00),
('INM-2026-0013', 1, 'NOP-890', 'Honda', 'Civic', 2018, 'OBSERVADO', 240.00),
('INM-2026-0014', 2, 'QRS-901', 'Suzuki', 'Swift', 2021, 'APROBADO', 275.00),
('INM-2026-0015', 3, 'TUV-012', 'Volkswagen', 'Gol', 2019, 'FINALIZADO', 390.00),
('INM-2026-0016', 4, NULL, 'Renault', 'Duster', 2023, 'REGISTRADO', 185.00),

('INM-2026-0017', 1, 'ABC-201', 'Toyota', 'RAV4', 2022, 'EN_REVISION', 350.00),
('INM-2026-0018', 2, 'DEF-312', 'Hyundai', 'Elantra', 2020, 'APROBADO', 290.00),
('INM-2026-0019', 3, NULL, 'Kia', 'Seltos', 2023, 'REGISTRADO', 210.00),
('INM-2026-0020', 4, 'GHI-423', 'Nissan', 'Kicks', 2021, 'FINALIZADO', 480.00),
('INM-2026-0021', 1, 'JKL-534', 'Mitsubishi', 'Outlander', 2019, 'RECHAZADO', 260.00),
('INM-2026-0022', 2, 'MNO-645', 'Toyota', 'Hilux', 2022, 'APROBADO', 375.00),

('INM-2026-0023', 3, 'PQR-756', 'Ford', 'EcoSport', 2020, 'EN_REVISION', 225.00),
('INM-2026-0024', 4, NULL, 'Chevrolet', 'Tracker', 2023, 'REGISTRADO', 190.00),
('INM-2026-0025', 1, 'STU-867', 'Honda', 'HR-V', 2021, 'APROBADO', 315.00),
('INM-2026-0026', 2, 'VWX-978', 'Mazda', 'Mazda 3', 2020, 'OBSERVADO', 245.00),
('INM-2026-0027', 3, 'YZA-089', 'Suzuki', 'Vitara', 2018, 'FINALIZADO', 410.00),
('INM-2026-0028', 4, 'BCD-190', 'Volkswagen', 'T-Cross', 2022, 'EN_REVISION', 330.00),

('INM-2026-0029', 1, NULL, 'Nissan', 'X-Trail', 2021, 'REGISTRADO', 180.00),
('INM-2026-0030', 2, 'EFG-301', 'Toyota', 'Fortuner', 2023, 'APROBADO', 520.00),
('INM-2026-0031', 3, 'HIJ-412', 'Kia', 'Sportage', 2022, 'FINALIZADO', 460.00),
('INM-2026-0032', 4, 'KLM-523', 'Hyundai', 'Santa Fe', 2020, 'OBSERVADO', 285.00),
('INM-2026-0033', 1, 'NOP-634', 'Renault', 'Kwid', 2019, 'RECHAZADO', 160.00),
('INM-2026-0034', 2, NULL, 'Chevrolet', 'Tracker', 2022, 'REGISTRADO', 205.00),

('INM-2026-0035', 3, 'QRS-745', 'Ford', 'Escape', 2021, 'EN_REVISION', 295.00),
('INM-2026-0036', 4, 'TUV-856', 'Toyota', 'Camry', 2019, 'APROBADO', 340.00),
('INM-2026-0037', 1, 'VWX-967', 'Honda', 'CR-V', 2023, 'FINALIZADO', 490.00),
('INM-2026-0038', 2, 'YZA-178', 'Mazda', 'CX-30', 2022, 'EN_REVISION', 275.00),
('INM-2026-0039', 3, NULL, 'Kia', 'Picanto', 2020, 'REGISTRADO', 150.00),
('INM-2026-0040', 4, 'BCD-289', 'Nissan', 'Sentra', 2021, 'APROBADO', 310.00),

('INM-2026-0041', 1, 'EFG-390', 'Volkswagen', 'Tiguan', 2022, 'OBSERVADO', 295.00),
('INM-2026-0042', 2, 'HIJ-401', 'Toyota', 'Avanza', 2019, 'FINALIZADO', 380.00),
('INM-2026-0043', 3, 'KLM-512', 'Hyundai', 'Creta', 2023, 'APROBADO', 325.00),
('INM-2026-0044', 4, NULL, 'Suzuki', 'Jimny', 2021, 'REGISTRADO', 170.00),
('INM-2026-0045', 1, 'NOP-623', 'Mitsubishi', 'ASX', 2020, 'EN_REVISION', 255.00),
('INM-2026-0046', 2, 'PQR-734', 'Ford', 'Ranger', 2022, 'APROBADO', 415.00),

('INM-2026-0047', 3, 'STU-845', 'Chevrolet', 'Sail', 2018, 'FINALIZADO', 360.00),
('INM-2026-0048', 4, 'VWX-956', 'Renault', 'Captur', 2021, 'OBSERVADO', 235.00),
('INM-2026-0049', 1, NULL, 'Kia', 'Carens', 2022, 'REGISTRADO', 190.00),
('INM-2026-0050', 2, 'YZA-067', 'Toyota', 'Hilux', 2023, 'EN_REVISION', 375.00);

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
(6, 'EN_REVISION', 'RECHAZADO', 'No cumple requisitos minimos del proceso.', 'supervisor'),
(5, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(5, 'REGISTRADO', 'EN_REVISION', 'Documentación enviada a revisión.', 'operador'),
(6, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(7, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(7, 'REGISTRADO', 'EN_REVISION', 'Documentación revisada.', 'operador'),
(7, 'EN_REVISION', 'APROBADO', 'Trámite aprobado.', 'supervisor'),
(8, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(8, 'REGISTRADO', 'EN_REVISION', 'Documentación en revisión.', 'operador'),
(8, 'EN_REVISION', 'RECHAZADO', 'Documentación no cumple los requisitos.', 'supervisor'),
(9, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(9, 'REGISTRADO', 'EN_REVISION', 'Documentación revisada.', 'operador'),
(9, 'EN_REVISION', 'APROBADO', 'Trámite aprobado.', 'supervisor'),
(9, 'APROBADO', 'FINALIZADO', 'Trámite finalizado.', 'operador'),
(10, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(10, 'REGISTRADO', 'EN_REVISION', 'Documentación revisada.', 'operador'),
(10, 'EN_REVISION', 'APROBADO', 'Trámite aprobado.', 'supervisor'),
(11, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(12, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(12, 'REGISTRADO', 'EN_REVISION', 'Documentación enviada a revisión.', 'operador'),
(13, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(13, 'REGISTRADO', 'EN_REVISION', 'Documentación revisada.', 'operador'),
(13, 'EN_REVISION', 'OBSERVADO', 'Se requiere documentación adicional.', 'supervisor'),
(14, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(14, 'REGISTRADO', 'EN_REVISION', 'Documentación revisada.', 'operador'),
(14, 'EN_REVISION', 'APROBADO', 'Trámite aprobado.', 'supervisor'),
(15, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(15, 'REGISTRADO', 'EN_REVISION', 'Documentación revisada.', 'operador'),
(15, 'EN_REVISION', 'APROBADO', 'Trámite aprobado.', 'supervisor'),
(15, 'APROBADO', 'FINALIZADO', 'Trámite finalizado.', 'operador'),
(16, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(17, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(17, 'REGISTRADO', 'EN_REVISION', 'Documentación enviada a revisión.', 'operador'),
(18, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(18, 'REGISTRADO', 'EN_REVISION', 'Documentación revisada.', 'operador'),
(18, 'EN_REVISION', 'APROBADO', 'Trámite aprobado.', 'supervisor'),
(19, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(20, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(20, 'REGISTRADO', 'EN_REVISION', 'Documentación revisada.', 'operador'),
(20, 'EN_REVISION', 'APROBADO', 'Trámite aprobado.', 'supervisor'),
(20, 'APROBADO', 'FINALIZADO', 'Trámite finalizado.', 'operador'),
(21, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(21, 'REGISTRADO', 'EN_REVISION', 'Documentación revisada.', 'operador'),
(21, 'EN_REVISION', 'RECHAZADO', 'No cumple con los requisitos establecidos.', 'supervisor'),
(22, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(22, 'REGISTRADO', 'EN_REVISION', 'Documentación revisada.', 'operador'),
(22, 'EN_REVISION', 'APROBADO', 'Trámite aprobado.', 'supervisor'),
(23, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(23, 'REGISTRADO', 'EN_REVISION', 'Documentación enviada a revisión.', 'operador'),
(24, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(25, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(25, 'REGISTRADO', 'EN_REVISION', 'Documentación revisada.', 'operador'),
(25, 'EN_REVISION', 'APROBADO', 'Trámite aprobado.', 'supervisor'),
(26, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(26, 'REGISTRADO', 'EN_REVISION', 'Documentación revisada.', 'operador'),
(26, 'EN_REVISION', 'OBSERVADO', 'Se requiere corregir documentación.', 'supervisor'),
(27, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(27, 'REGISTRADO', 'EN_REVISION', 'Documentación revisada.', 'operador'),
(27, 'EN_REVISION', 'APROBADO', 'Trámite aprobado.', 'supervisor'),
(27, 'APROBADO', 'FINALIZADO', 'Trámite finalizado.', 'operador'),
(28, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(28, 'REGISTRADO', 'EN_REVISION', 'Documentación enviada a revisión.', 'operador'),
(29, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(30, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(30, 'REGISTRADO', 'EN_REVISION', 'Documentación revisada.', 'operador'),
(30, 'EN_REVISION', 'APROBADO', 'Trámite aprobado.', 'supervisor'),
(31, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(31, 'REGISTRADO', 'EN_REVISION', 'Documentación revisada.', 'operador'),
(31, 'EN_REVISION', 'APROBADO', 'Trámite aprobado.', 'supervisor'),
(31, 'APROBADO', 'FINALIZADO', 'Trámite finalizado.', 'operador'),
(32, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(32, 'REGISTRADO', 'EN_REVISION', 'Documentación revisada.', 'operador'),
(32, 'EN_REVISION', 'OBSERVADO', 'Se requiere documentación adicional.', 'supervisor'),
(33, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(33, 'REGISTRADO', 'EN_REVISION', 'Documentación revisada.', 'operador'),
(33, 'EN_REVISION', 'RECHAZADO', 'No cumple con los requisitos establecidos.', 'supervisor'),
(34, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(35, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(35, 'REGISTRADO', 'EN_REVISION', 'Documentación enviada a revisión.', 'operador'),
(36, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(36, 'REGISTRADO', 'EN_REVISION', 'Documentación revisada.', 'operador'),
(36, 'EN_REVISION', 'APROBADO', 'Trámite aprobado.', 'supervisor'),
(37, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(37, 'REGISTRADO', 'EN_REVISION', 'Documentación revisada.', 'operador'),
(37, 'EN_REVISION', 'APROBADO', 'Trámite aprobado.', 'supervisor'),
(37, 'APROBADO', 'FINALIZADO', 'Trámite finalizado.', 'operador'),
(38, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(38, 'REGISTRADO', 'EN_REVISION', 'Documentación enviada a revisión.', 'operador'),
(39, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(40, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(40, 'REGISTRADO', 'EN_REVISION', 'Documentación revisada.', 'operador'),
(40, 'EN_REVISION', 'APROBADO', 'Trámite aprobado.', 'supervisor'),
(41, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(41, 'REGISTRADO', 'EN_REVISION', 'Documentación revisada.', 'operador'),
(41, 'EN_REVISION', 'OBSERVADO', 'Se requiere documentación adicional.', 'supervisor'),
(42, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(42, 'REGISTRADO', 'EN_REVISION', 'Documentación revisada.', 'operador'),
(42, 'EN_REVISION', 'APROBADO', 'Trámite aprobado.', 'supervisor'),
(42, 'APROBADO', 'FINALIZADO', 'Trámite finalizado.', 'operador'),
(43, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(43, 'REGISTRADO', 'EN_REVISION', 'Documentación revisada.', 'operador'),
(43, 'EN_REVISION', 'APROBADO', 'Trámite aprobado.', 'supervisor'),
(44, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(45, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(45, 'REGISTRADO', 'EN_REVISION', 'Documentación enviada a revisión.', 'operador'),
(46, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(46, 'REGISTRADO', 'EN_REVISION', 'Documentación revisada.', 'operador'),
(46, 'EN_REVISION', 'APROBADO', 'Trámite aprobado.', 'supervisor'),
(47, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(47, 'REGISTRADO', 'EN_REVISION', 'Documentación revisada.', 'operador'),
(47, 'EN_REVISION', 'APROBADO', 'Trámite aprobado.', 'supervisor'),
(47, 'APROBADO', 'FINALIZADO', 'Trámite finalizado.', 'operador'),
(48, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(48, 'REGISTRADO', 'EN_REVISION', 'Documentación revisada.', 'operador'),
(48, 'EN_REVISION', 'OBSERVADO', 'Se requiere documentación adicional.', 'supervisor'),
(49, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(50, NULL, 'REGISTRADO', 'Trámite registrado correctamente.', 'operador'),
(50, 'REGISTRADO', 'EN_REVISION', 'Documentación enviada a revisión.', 'operador');