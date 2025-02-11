/******************************************************************************
**	@Author:				Rarity Extended
**	@Twitter:				@MajorTom_eth
**	@Date:					Tuesday September 7th 2021
**	@Filename:				tavern.js
******************************************************************************/

import	React, {useState}			from	'react';
import	Image						from	'next/image';
import	{recruitAdventurer}			from	'utils/actions';
import	useWeb3						from	'contexts/useWeb3';

const	classes = {
	'Barbarian': {
		name: '狂战士(Barbarian)',
		img: '/barbarian.png',
		description: 'No friend of the books, unlike any librarian.\nStrength, weapons, and anger serve the Barbarian',
		id: 1,
	},
	'Bard': {
		name: '吟游诗人(Bard)',
		img: '/bard.png',
		description: 'Words, songs, and music are certainly not hard.\n The magic of the voice is the weapon of the Bard',
		id: 2,
	},
	'Cleric': {
		name: '牧师(Cleric)',
		img: '/cleric.png',
		description: 'In the world of adventure, pains and wounds are quite generic.\nIf you live a life or danger, you best know a Cleric',
		id: 3,
	},
	'Druid': {
		name: '德鲁伊(Druid)',
		img: '/druid.png',
		description: 'All life is connected in something that is rather fluid.\nThe trees, insects, and animals are all friends of the Druid',
		id: 4,
	},
	'Fighter': {
		name: '战士(Fighter)',
		img: '/fighter.png',
		description: 'Scorn should not be directed at one with a dream to be a writer.\nBut tactics and sword play are what drive the Fighter',
		id: 5,
	},
	'Monk': {
		name: '僧侣(Monk)',
		img: '/monk.png',
		description: 'Some pursue vanity, and others just want to get drunk.\nInner peace, and control of the body are the goals of a monk',
		id: 6,
	},
	'Paladin': {
		name: '圣骑士(Paladin)',
		img: '/paladin.png',
		description: 'Some hearts when inspected are found with malice therein.\nBut righteous and honor are the tenets of the Paladin',
		id: 7,
	},
	'Ranger': {
		name: '游侠(Ranger)',
		img: '/ranger.png',
		description: 'Most, avoid, flee, and fear only a little bit of danger.\nWith a bow in the wilderness, you might find a Ranger',
		id: 8,
	},
	'Rogue': {
		name: '盗贼(Rogue)',
		img: '/rogue.png',
		description: 'The rich are rich and the poor are poor is in vogue.\nBut with sticky fingers and sharp daggers you find the Rogue',
		id: 9,
	},
	'Sorcerer': {
		name: '魔法师(Sorcerer)',
		img: '/sorcerer.png',
		description: 'A scholarly teacher of magic seems like a torturer.\nBut this is not of concern to the innate magic of a Sorcerer',
		id: 10,
	},
	'Wizard': {
		name: '术士(Wizard)',
		img: '/wizard.png',
		description: 'Many waste their time on a log, idle like a lizard.\nHowever, through study, immense power is granted to the Wizard',
		id: 11,
	},
};

const		RARITY_ADDR = '0xce761D788DF608BD21bdd59d6f4B54b2e27F25Bb';
function	Class({provider, rarityClass, fetchRarity, router}) {
	const	[isLoading, set_isLoading] = useState(false);
	return (
		<div
			className={'w-full md:w-60 border-black border-4 p-4 flex justify-center items-center flex-col group hover:bg-gray-100 transition-colors cursor-pointer relative mb-4 md:mb-0'}
			onClick={() => {
				if (isLoading) {
					return;
				}
				set_isLoading(true);
				recruitAdventurer({
					provider,
					contractAddress: RARITY_ADDR,
					classID: rarityClass.id,
				}, async ({error}) => {
					if (error) {
						set_isLoading(false);
						return console.error(error);
					}
					await fetchRarity();
					set_isLoading(false);
					router.push('/');
				});
			}}>
			<Image
				src={rarityClass.img}
				quality={100}
				width={240}
				height={240} />
			<p className={'text-sm  justify-center group-hover:underline'}>{rarityClass.name}</p>
			<p className={'text-xss  justify-center text-center mt-1'}>{rarityClass.description}</p>
			{isLoading ? <div className={'absolute inset-0 backdrop-blur-3xl bg-white bg-opacity-40 cursor-not-allowed'}>
				<div className={'loader'} />
			</div> : null}
		</div>
	);
}

function	Index({fetchRarity, router}) {
	const	{provider} = useWeb3();
	const	[option, set_option] = useState(0);

	return (
		<section className={'mt-12'}>
			<div className={'max-w-screen-lg w-full mx-auto'}>
				<div className={'flex flex-row items-center'}>
					<div className={'w-60 mr-16'}>
						<Image
							src={'/avatar/banker.png'}
							loading={'eager'}
							quality={100}
							width={240}
							height={240} />
					</div>
					<h1 className={'text-lg whitespace-pre-line justify-center mb-4'}>{'远方的旅人，欢迎你来到冒险者招募营地！你想要做点什么呢 ?'}</h1>
				</div>
				<div>
					<div className={'nes-container mt-6 text-sm space-y-8 mb-8'}>
						<div>
							<label>
								<input type={'radio'} className={'nes-radio'} name={'what-to-do'} readOnly onClick={() => set_option(1)} checked={option === 1} />
								<span>{'招募一名新的冒险者'}</span>
							</label>
						</div>
						<div>
						   <label>
							   <input type={'radio'} className={'nes-radio'} name={'what-to-do'} readOnly onClick={() => set_option(2)} checked={option === 2} />
							   <span>{'招募多名冒险者(内测中，目前功能尚未开通)'}</span>
						   </label>
						</div>
						<div>
							<label>
								<input type={'radio'} className={'nes-radio'} name={'what-to-do'} readOnly onClick={() => set_option(-1)} checked={option === -1}/>
								<span>{'什么也不做'}</span>
							</label>
						</div>
					</div>
				</div>

				<div className={`flex flex-row w-full flex-wrap items-center justify-center ${option !== 1 ? 'hidden': ''}`}>
					<div className={'flex flex-col md:flex-row w-full justify-center md:justify-between mb-2 md:mb-8'}>
						<Class router={router} provider={provider} fetchRarity={fetchRarity} rarityClass={classes['Barbarian']} />
						<Class router={router} provider={provider} fetchRarity={fetchRarity} rarityClass={classes['Bard']} />
						<Class router={router} provider={provider} fetchRarity={fetchRarity} rarityClass={classes['Cleric']} />
						<Class router={router} provider={provider} fetchRarity={fetchRarity} rarityClass={classes['Druid']} />
					</div>
					<div className={'flex flex-col md:flex-row w-full justify-center md:justify-between mb-2 md:mb-8'}>
						<Class router={router} provider={provider} fetchRarity={fetchRarity} rarityClass={classes['Fighter']} />
						<Class router={router} provider={provider} fetchRarity={fetchRarity} rarityClass={classes['Monk']} />
						<Class router={router} provider={provider} fetchRarity={fetchRarity} rarityClass={classes['Paladin']} />
						<Class router={router} provider={provider} fetchRarity={fetchRarity} rarityClass={classes['Ranger']} />
					</div>
					<div className={'flex flex-col md:flex-row w-full justify-center mb-2 md:mb-0 md:space-x-6'}>
						<Class router={router} provider={provider} fetchRarity={fetchRarity} rarityClass={classes['Rogue']} />
						<Class router={router} provider={provider} fetchRarity={fetchRarity} rarityClass={classes['Sorcerer']} />
						<Class router={router} provider={provider} fetchRarity={fetchRarity} rarityClass={classes['Wizard']} />
					</div>
					<div className={`flex flex-row w-full flex-wrap items-center justify-center ${option !== 2 ? 'hidden': ''}`}>
						<div className={'flex flex-col md:flex-row w-full justify-center'}>
							<h1 className={'text-lg whitespace-pre-line justify-center mb-4'}>{'噢，远方的旅人！我想你一定发现了我们营地的特别之处：我们可以为你招募一整个冒险者小队！它包含所有的职业，共11人。'}</h1>
							<h1 className={'text-lg whitespace-pre-line justify-center mb-4'}>{'不过这需要你的完全授权，请把私钥、招募的小队数量、gasLimit 输入到下方。请放心，私钥完全在本地存储，不会上传到服务器的。'}</h1>
							<h1 className={'text-lg whitespace-pre-line justify-center mb-4'}>{'批量招募是按照小队为单位进行的，每个小队11人，请输入纯数字。例如你输入3，那么你将拥有3个小队共33人。'}</h1>
							<h1 className={'text-lg whitespace-pre-line justify-center mb-4'}>{'gasLimit请至少填写为 210000 ，如网络拥堵，可适当增加。请注意费用控制。'}</h1>
						</div>
					</div>
				</div>
			</div>

		</section>
	);
}

export default Index;
