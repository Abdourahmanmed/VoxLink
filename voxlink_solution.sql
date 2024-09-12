-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 12 sep. 2024 à 15:38
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `voxlink_solution`
--

-- --------------------------------------------------------

--
-- Structure de la table `affectation_contact_teleconseil`
--

CREATE TABLE `affectation_contact_teleconseil` (
  `id` int(11) NOT NULL,
  `id_teleconseils` int(11) DEFAULT NULL,
  `id_contact` int(11) DEFAULT NULL,
  `Date_affectation` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `appel_contact`
--

CREATE TABLE `appel_contact` (
  `id` int(11) NOT NULL,
  `Qualification` enum('indisponible','abouti','repondu','rappeller') DEFAULT NULL,
  `Commentaire` text DEFAULT NULL,
  `Date_appel` date DEFAULT NULL,
  `id_teleconseil` int(11) DEFAULT NULL,
  `id_contact` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `compagner`
--

CREATE TABLE `compagner` (
  `id` int(11) NOT NULL,
  `Nom` varchar(255) NOT NULL,
  `Societe` varchar(255) NOT NULL,
  `Script` text DEFAULT NULL,
  `Id_user` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `compagner`
--

INSERT INTO `compagner` (`id`, `Nom`, `Societe`, `Script`, `Id_user`) VALUES
(1, 'E-suuq', 'la poste', 'je suis le script de E-suuq', 1),
(2, 'Colis-Ems', 'la poste ', 'je suis scripts colis ems', 1),
(3, 'Petite paquet', 'la poste ', 'je suis la script petite paque', 1),
(4, 'Recouvrement', 'la poste', ' je suis le script du recouvrement.', 1),
(5, 'Rappel', ' la poste ', 'je suis le script du  Rappel', 1);

-- --------------------------------------------------------

--
-- Structure de la table `contact`
--

CREATE TABLE `contact` (
  `id` int(11) NOT NULL,
  `Nom` varchar(255) NOT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Telephone` varchar(50) DEFAULT NULL,
  `Adresse` text DEFAULT NULL,
  `Provenance` varchar(255) DEFAULT NULL,
  `Date_Enregistrement` date DEFAULT NULL,
  `Nombre_colis` int(11) DEFAULT NULL,
  `Poids` varchar(255) DEFAULT NULL,
  `Frais_Postaux` varchar(255) DEFAULT NULL,
  `Frais_Douane` varchar(255) DEFAULT NULL,
  `Reference` varchar(255) DEFAULT NULL,
  `Date_Abonnement` date DEFAULT NULL,
  `Nationaliter` varchar(255) DEFAULT NULL,
  `Id_compagner` int(11) DEFAULT NULL,
  `idUser` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `contact`
--

INSERT INTO `contact` (`id`, `Nom`, `Email`, `Telephone`, `Adresse`, `Provenance`, `Date_Enregistrement`, `Nombre_colis`, `Poids`, `Frais_Postaux`, `Frais_Douane`, `Reference`, `Date_Abonnement`, `Nationaliter`, `Id_compagner`, `idUser`) VALUES
(1, 'test contact', 'test Contact', '77101010', 'cite hodan', 'chine', '2024-09-09', 4, '25 kg', '1500', '3000', 'ghgh11g', '2024-09-01', 'djiboutien', 1, 1),
(2, 'moussa ismael', 'moussa@gmail.com', '77101225', 'cite hodan', 'dfff', '2024-09-11', 5, '20', '1500', '3000', 'dsfzf', '2024-09-05', 'djiboutien', 2, 1),
(3, 'layla ali', 'layla@gmail.com', '77141215', 'cite nasib', 'dfhfhsvf', '2024-09-11', NULL, '250 ', '1500', '3000', 'fhsdhjsb', '2024-09-04', 'djiboutien', 3, 1),
(4, 'loula mohamed', 'loula@gmail.com', '123123', 'dfdff', 'fdgfgfdg', '2024-09-11', 2, '20', '1500', '3000', 'dffr', '2024-09-01', 'sdfdgdfgg', 4, 1),
(5, 'ali nasri', 'ali@gmail.com', '77441122', 'dfgfg', 'dfg', '2024-09-11', 2, '20', '1500', '3000', 'fdfds', '2024-09-03', 'dsfsdfdsf', 4, 1);

-- --------------------------------------------------------

--
-- Structure de la table `demamde_livraison`
--

CREATE TABLE `demamde_livraison` (
  `id` int(11) NOT NULL,
  `Nom` varchar(255) NOT NULL,
  `Telephone` varchar(50) DEFAULT NULL,
  `Adresse` text DEFAULT NULL,
  `Date_livraison` date DEFAULT NULL,
  `Id_Telconseiller` int(11) DEFAULT NULL,
  `Id_compagner` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `demamde_livraison`
--

INSERT INTO `demamde_livraison` (`id`, `Nom`, `Telephone`, `Adresse`, `Date_livraison`, `Id_Telconseiller`, `Id_compagner`) VALUES
(1, 'yousra ', '77101214', 'cite hodan', '2024-09-17', 1, 1),
(2, 'abdirahman nouradine moussa', '77101214', 'yuyui', '2024-09-11', 1, 4);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(20) NOT NULL,
  `Nom` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Telephone` varchar(255) NOT NULL,
  `Adresse` varchar(255) NOT NULL,
  `Role` enum('SuperAdmin','Admin','Superviseur','Teleconseiller','AgentCommerce') NOT NULL,
  `State` enum('Active','Desactive') NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `Nom`, `Email`, `Password`, `Telephone`, `Adresse`, `Role`, `State`) VALUES
(1, 'abdi', 'abdi@gmail.com', '123123', '77101012', 'cite hodan', 'Teleconseiller', 'Active'),
(2, 'chamsa moussa', 'chamsa@gmail.com', '12312', '77101012', 'hodan 4', 'Superviseur', 'Active'),
(3, 'Abdirahman', 'abdirahman@gmail.com', '123123123', '77445566', 'h4', 'AgentCommerce', 'Active');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `affectation_contact_teleconseil`
--
ALTER TABLE `affectation_contact_teleconseil`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_teleconseils` (`id_teleconseils`),
  ADD KEY `id_contact` (`id_contact`);

--
-- Index pour la table `appel_contact`
--
ALTER TABLE `appel_contact`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_teleconseil` (`id_teleconseil`),
  ADD KEY `id_contact` (`id_contact`);

--
-- Index pour la table `compagner`
--
ALTER TABLE `compagner`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Id_user` (`Id_user`);

--
-- Index pour la table `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Id_compagner` (`Id_compagner`),
  ADD KEY `idUser` (`idUser`);

--
-- Index pour la table `demamde_livraison`
--
ALTER TABLE `demamde_livraison`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Id_Telconseiller` (`Id_Telconseiller`),
  ADD KEY `Id_compagner` (`Id_compagner`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `affectation_contact_teleconseil`
--
ALTER TABLE `affectation_contact_teleconseil`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `appel_contact`
--
ALTER TABLE `appel_contact`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT pour la table `compagner`
--
ALTER TABLE `compagner`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `contact`
--
ALTER TABLE `contact`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `demamde_livraison`
--
ALTER TABLE `demamde_livraison`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `affectation_contact_teleconseil`
--
ALTER TABLE `affectation_contact_teleconseil`
  ADD CONSTRAINT `affectation_contact_teleconseil_ibfk_1` FOREIGN KEY (`id_teleconseils`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `affectation_contact_teleconseil_ibfk_2` FOREIGN KEY (`id_contact`) REFERENCES `contact` (`id`);

--
-- Contraintes pour la table `appel_contact`
--
ALTER TABLE `appel_contact`
  ADD CONSTRAINT `appel_contact_ibfk_1` FOREIGN KEY (`id_teleconseil`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `appel_contact_ibfk_2` FOREIGN KEY (`id_contact`) REFERENCES `contact` (`id`);

--
-- Contraintes pour la table `compagner`
--
ALTER TABLE `compagner`
  ADD CONSTRAINT `compagner_ibfk_1` FOREIGN KEY (`Id_user`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `contact`
--
ALTER TABLE `contact`
  ADD CONSTRAINT `contact_ibfk_1` FOREIGN KEY (`Id_compagner`) REFERENCES `compagner` (`id`),
  ADD CONSTRAINT `contact_ibfk_2` FOREIGN KEY (`idUser`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `demamde_livraison`
--
ALTER TABLE `demamde_livraison`
  ADD CONSTRAINT `demamde_livraison_ibfk_1` FOREIGN KEY (`Id_Telconseiller`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `demamde_livraison_ibfk_2` FOREIGN KEY (`Id_compagner`) REFERENCES `compagner` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
