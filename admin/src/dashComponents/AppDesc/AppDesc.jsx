import React from 'react';
import './AppDesc.scss';
import Skill from '../Skill/Skill';
import { v4 as uuidv4 } from 'uuid';

const AppDesc = () => {
	const projectDetails = [
		{
			title: 'Backend',
			stack: 'MongoDB + Express.js + Nodemailer',
			details: [
				'zakładanie konta',
				'mailowa weryfikacja użytkownika',
				'prosta walidacja formularza',
				'resetowanie hasła',
			],
		},
		{
			title: 'Frontend - Klient',
			stack: 'React.js + Zustand',
			details: [
				'złożenie zamówienia będąc zalogowanym lub bez zakładania konta',
				'dodawanie produktu do koszyka',
				'aktualizacja koszyka po zalogowaniu',
				'prosta walidacja formularza',
				'dodawanie / aktualizacja adresu dostawy',
				'śledzenie statusu zamówienia',
				'kod weryfikacyjny do śledzenia statusu dla użytkowników bez założonego konta',
				'aktualizacja koszyka po zalogowaniu',
				'dostęp do wszystkich zamówień dla zalogowanych użytkowników',
			],
		},
		{
			title: 'Frontend - Administrator',
			stack: 'React.js + Zustand',
			details: [
				'wysłanie prośby o przyznanie uprawień admnistratora dla zarejestrowanych użytkowników',
				'dodawanie / aktualizacja kategorii',
				'dodawanie / aktualizacja przedmiotów',
				'dodawanie / aktualizacja adresu dostawy',
				'dodawanie kodu rabatowego dla wszystkich lub wybranegoużytkownika',
				'dodawanie / odbieranie uprawnień administratora',
				'aktualizacja statusu zamówienia',
			],
		},
	];

	const about = [
		'Nazywam się <span>Aleksandra Śniegucka</span> i miło mi, że właśnie odwiedzasz stronę z moim projektem.',
		'Powstał po dłuższej przerwie w programowaniu, do którego chcę powrócić także w kontekście zawodowym. Ma na celu uzupełnienie CV oraz udowodnienie umiejętności nabytych samodzielnie poprzez wgląd do dokumentacji i innych otwartych projektów.',
		'Osobiście uważam, że lepiej radzę sobie na backendzie, w przypadku frontendu (ze względu na specyficzny gust) inspiruję się innymi projektami udostępnionymi w sieci.',

		'Działam w Reacie (<span>MERN Stack</span>), starając się tworzyć własne skrypty bez zbędnego wykorzystywania zewnętrznych paczek, które mogą negatywnie wpływać na optymalizację renderowanego kodu.',
		'Moim celem jest tworzenie większości komponentów i funkcji od podstaw, co wpływa na własny rozwój oraz umożliwia elastyczne zarządzanie kodem.',
	];
	return (
		<>
			<ol style={{ '--length': '1' }} role='list' className='appDesc profile'>
				<li style={{ '--i': '0' }}>
					<h5>Dzień dobry ;)</h5>
					{about.map((item) => {
						const markup = { __html: item };
						return <p key={uuidv4()} dangerouslySetInnerHTML={markup}></p>;
					})}
				</li>
			</ol>
			<ol
				style={{ '--length': projectDetails.length }}
				role='list'
				className='appDesc'
			>
				{projectDetails.map((item, i) => (
					<li style={{ '--i': i }} key={uuidv4()}>
						<h3>{item.title}</h3>
						<h4>{item.stack}</h4>
						<ol style={{ '--length': item.details.length }} role='list'>
							{item.details.map((i, x) => (
								<li style={{ '--i': x + 1 }} key={uuidv4()}>
									<span>{i}</span>
								</li>
							))}
						</ol>
					</li>
				))}
			</ol>

			<Skill />
		</>
	);
};

export default AppDesc;
