-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-03-2018 a las 17:44:13
-- Versión del servidor: 10.1.21-MariaDB
-- Versión de PHP: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bdmouvers`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `calificaciones`
--

CREATE TABLE `calificaciones` (
  `id` int(10) UNSIGNED NOT NULL,
  `pedido_id` int(10) UNSIGNED NOT NULL,
  `puntaje` int(11) NOT NULL,
  `comentario` text COLLATE utf8_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `imagen` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `estado` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`, `imagen`, `estado`, `created_at`, `updated_at`) VALUES
(1, 'cat1', 'imagen', 'ON', '2018-03-02 14:39:18', '2018-03-02 14:39:18'),
(2, 'cat2', 'imagen', 'ON', '2018-03-02 14:39:29', '2018-03-02 14:39:29');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `establecimientos`
--

CREATE TABLE `establecimientos` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `direccion` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `lat` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `lng` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `estado` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `num_pedidos` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `establecimientos`
--

INSERT INTO `establecimientos` (`id`, `nombre`, `direccion`, `lat`, `lng`, `estado`, `num_pedidos`, `created_at`, `updated_at`) VALUES
(1, 'establecimiento1', 'los chorros', NULL, NULL, 'ON', 0, '2018-03-01 00:44:09', '2018-03-01 00:44:09'),
(2, 'establecimiento2', 'merida', NULL, NULL, 'ON', 0, '2018-03-02 14:34:15', '2018-03-02 14:34:15');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `migration` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`migration`, `batch`) VALUES
('2017_09_25_201538_usuarios_migration', 1),
('2018_02_07_104756_categorias_migration', 1),
('2018_02_07_105512_subCategorias_migration', 1),
('2018_02_07_134905_establecimientos_migration', 1),
('2018_02_07_202032_productos_migration', 1),
('2018_02_14_153432_pedidos_migration', 1),
('2018_02_14_161849_pedido_productos_migration', 1),
('2018_02_14_162547_calificaciones_migration', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id` int(10) UNSIGNED NOT NULL,
  `estado` int(11) NOT NULL,
  `lat` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `lng` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `direccion` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `distancia` double(8,2) DEFAULT NULL,
  `tiempo` double(8,2) DEFAULT NULL,
  `costo` double(8,2) NOT NULL,
  `usuario_id` int(10) UNSIGNED NOT NULL,
  `repartidor_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido_productos`
--

CREATE TABLE `pedido_productos` (
  `id` int(10) UNSIGNED NOT NULL,
  `pedido_id` int(10) UNSIGNED NOT NULL,
  `producto_id` int(10) UNSIGNED NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` double(8,2) NOT NULL,
  `observacion` text COLLATE utf8_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `precio` double(8,2) DEFAULT NULL,
  `imagen` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `descripcion` text COLLATE utf8_unicode_ci,
  `estado` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `subcategoria_id` int(10) UNSIGNED NOT NULL,
  `establecimiento_id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `precio`, `imagen`, `descripcion`, `estado`, `subcategoria_id`, `establecimiento_id`, `created_at`, `updated_at`) VALUES
(1, 'prod1', 12.00, 'imagen', NULL, 'ON', 1, 1, '2018-03-02 14:40:59', '2018-03-02 14:40:59'),
(2, 'prod2', 16.00, 'imagen', NULL, 'ON', 2, 2, '2018-03-02 14:41:23', '2018-03-02 14:41:23');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subcategorias`
--

CREATE TABLE `subcategorias` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `imagen` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `estado` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `categoria_id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `subcategorias`
--

INSERT INTO `subcategorias` (`id`, `nombre`, `imagen`, `estado`, `categoria_id`, `created_at`, `updated_at`) VALUES
(1, 'subcat1', 'imagen', 'ON', 1, '2018-03-02 14:39:58', '2018-03-02 14:39:58'),
(2, 'subcat2', 'imagen', 'ON', 2, '2018-03-02 14:40:23', '2018-03-02 14:40:23');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `nombre` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `ciudad` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `estado` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `telefono` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `imagen` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `tipo_usuario` int(11) NOT NULL,
  `tipo_registro` int(11) NOT NULL,
  `id_facebook` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `id_twitter` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `id_instagram` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `codigo_verificacion` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `validado` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `email`, `password`, `nombre`, `ciudad`, `estado`, `telefono`, `imagen`, `tipo_usuario`, `tipo_registro`, `id_facebook`, `id_twitter`, `id_instagram`, `codigo_verificacion`, `validado`, `created_at`, `updated_at`) VALUES
(1, 'admin@correo.com', '$2y$10$1j3DtcqE7becqzEDhdAgj.RXk3EzWUedVkTMXzU9qPYrphNcC7TUK', 'admin', 'ciudad', 'estado', '555555', NULL, 1, 1, NULL, NULL, NULL, NULL, 0, '2018-02-22 13:47:20', '2018-02-22 13:47:20'),
(2, 'ramirez.fred@hotmail.com', '$2y$10$VRQG/t7P4hNWRmS4XJa3JenXFjbA5YKAolCYevJKQjWDRgftvik8W', 'freddy', 'ciudad', 'estado', '45555', NULL, 1, 1, NULL, NULL, NULL, NULL, 0, '2018-02-25 18:06:36', '2018-02-25 18:06:36'),
(3, 'ramirez.fred2@hotmail.com', '$2y$10$uFgw/vpOpjmIITNYYAsdG.nbMoXwvPjdVAI/GfHfimkBi/XB7vssW', 'freddy2', 'ciudad', 'estado', '45555', NULL, 1, 1, NULL, NULL, NULL, NULL, 0, '2018-02-25 18:06:53', '2018-02-25 18:06:53'),
(4, 'ramirez.fred3@hotmail.com', '$2y$10$8rCSJQOKAzgzcZuJK3Uyke33RxzwKnn05At03N.RJnK6VxyrSZuTi', 'freddy3', 'ciudad', 'estado', '45555', NULL, 1, 1, NULL, NULL, NULL, NULL, 0, '2018-02-25 18:07:05', '2018-02-25 18:07:05'),
(5, 'ramirez.fred4@hotmail.com', '$2y$10$Z5K./jcSm.CyNwnKBeigPuTutOpJhFLPzdN19Kafd/xD7qts.Ig/a', 'freddy4', 'ciudad', 'estado', '45555', NULL, 1, 1, NULL, NULL, NULL, NULL, 0, '2018-02-25 18:07:16', '2018-02-25 18:07:16'),
(6, 'ramirez.fred5@hotmail.com', '$2y$10$gw.6okezvI5hKKKif4I6eeHp8xa9S76KloGjRUSJvjYpnU5kO8VxS', 'freddy5', 'ciudad', 'estado', '45555', NULL, 1, 1, NULL, NULL, NULL, NULL, 0, '2018-02-25 18:07:27', '2018-02-25 18:07:27'),
(7, 'ramirez.fred6@hotmail.com', '$2y$10$GgMQlVMw7iovtrN8veP67u2iqasVEhtyQJM5pax4NOHFebMbzj/2y', 'freddy6', 'ciudad', 'estado', '45555', NULL, 1, 1, NULL, NULL, NULL, NULL, 0, '2018-02-25 18:07:39', '2018-02-25 18:07:39');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `calificaciones`
--
ALTER TABLE `calificaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `calificaciones_pedido_id_foreign` (`pedido_id`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categorias_nombre_unique` (`nombre`);

--
-- Indices de la tabla `establecimientos`
--
ALTER TABLE `establecimientos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `establecimientos_nombre_unique` (`nombre`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pedidos_usuario_id_foreign` (`usuario_id`),
  ADD KEY `pedidos_repartidor_id_foreign` (`repartidor_id`);

--
-- Indices de la tabla `pedido_productos`
--
ALTER TABLE `pedido_productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pedido_productos_pedido_id_foreign` (`pedido_id`),
  ADD KEY `pedido_productos_producto_id_foreign` (`producto_id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `productos_subcategoria_id_foreign` (`subcategoria_id`),
  ADD KEY `productos_establecimiento_id_foreign` (`establecimiento_id`);

--
-- Indices de la tabla `subcategorias`
--
ALTER TABLE `subcategorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subcategorias_nombre_unique` (`nombre`),
  ADD KEY `subcategorias_categoria_id_foreign` (`categoria_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuarios_email_unique` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `calificaciones`
--
ALTER TABLE `calificaciones`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de la tabla `establecimientos`
--
ALTER TABLE `establecimientos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `pedido_productos`
--
ALTER TABLE `pedido_productos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de la tabla `subcategorias`
--
ALTER TABLE `subcategorias`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `calificaciones`
--
ALTER TABLE `calificaciones`
  ADD CONSTRAINT `calificaciones_pedido_id_foreign` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`);

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_repartidor_id_foreign` FOREIGN KEY (`repartidor_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `pedidos_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `pedido_productos`
--
ALTER TABLE `pedido_productos`
  ADD CONSTRAINT `pedido_productos_pedido_id_foreign` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`),
  ADD CONSTRAINT `pedido_productos_producto_id_foreign` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_establecimiento_id_foreign` FOREIGN KEY (`establecimiento_id`) REFERENCES `establecimientos` (`id`),
  ADD CONSTRAINT `productos_subcategoria_id_foreign` FOREIGN KEY (`subcategoria_id`) REFERENCES `subcategorias` (`id`);

--
-- Filtros para la tabla `subcategorias`
--
ALTER TABLE `subcategorias`
  ADD CONSTRAINT `subcategorias_categoria_id_foreign` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
