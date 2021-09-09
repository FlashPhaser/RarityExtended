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
import	{ethers}						from	'ethers';

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
			<p className={'font-title text-sm uppercase justify-center group-hover:underline'}>{rarityClass.name}</p>
			<p className={'font-title text-xss uppercase justify-center text-center mt-1'}>{rarityClass.description}</p>
			{isLoading ? <div className={'absolute inset-0 backdrop-blur-3xl bg-white bg-opacity-40 cursor-not-allowed'}>
				<div className={'loader'} />
			</div> : null}
		</div>
	);
}


async function summon(){
	const _key = document.getElementsByClassName('the_key')
	const _number = document.getElementsByClassName('the_number')
	const _gasLimit = document.getElementsByClassName('the_gasLimit')
	const logText = document.getElementById("log");
	const provider = new ethers.providers.JsonRpcProvider('https://rpcapi.fantom.network/')
	const classes = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11]
	const summonCountPerClass = parseInt(_number, 10)
	const MygasLimit = parseInt(_gasLimit, 10)
	const wallet = new ethers.Wallet(_key, provider)
	const account = wallet.connect(provider)
	const abi = ['function summon(uint256)']
	const rarityContractAddress = '0xce761d788df608bd21bdd59d6f4b54b2e27f25bb'
	const rarity = new ethers.Contract(rarityContractAddress, abi, account)
	const tokenIds = []
  
	let nonce = await provider.getTransactionCount(wallet.address)
  
	for (let i = 0; i < summonCountPerClass; i++) {
	  for (const c of classes) {
		console.log(`开始招募第 ${i + 1} 队的第 ${c}个冒险者... `)
		logText.value = logText.value + `开始招募第 ${i + 1} 队的第 ${c}个冒险者... `+'\r\n';
  
		const gasPrice = await provider.getGasPrice()
		//console.log(`gasPrice:`,gasPrice)
		const tx = await rarity.summon(c, {
		  gasPrice,
		  //nonce,
		  gasLimit: MygasLimit,
		})
		const receipt = await tx.wait()
  
		console.log(
		  `招募记录(链上交易记录) : https://ftmscan.com/tx/${receipt.logs[1].transactionHash}`
		)
		logText.value = logText.value + `招募记录(链上交易记录) : https://ftmscan.com/tx/${receipt.logs[1].transactionHash}`+'\r\n'
  
		const tokenId = parseInt(receipt.logs[0].topics[3], 16)
		tokenIds.push(tokenId)
  
		nonce++
  
		console.log(`第 ${tokenId} 号冒险者已经招募完毕!`)
		logText.value = logText.value + `第 ${tokenId} 号冒险者已经招募完毕!` +'\r\n';
  
		console.log('==============================')
		logText.value = logText.value + '==============================' +'\r\n';

		console.log('Summoned Token IDs:')
		logText.value = logText.value + 'Summoned Token IDs:' +'\r\n';

		console.log(tokenIds.join(','))
		logText.value = logText.value + tokenIds.join(',') +'\r\n';

		console.log('==============================')
		logText.value = logText.value + '==============================' +'\r\n';
	  }
	}
  }




function	Index({fetchRarity, router}) {
	const	{provider} = useWeb3();
	const	[option, set_option] = useState(-1);

	function summon1(){
		const _number = document.getElementById('the_number').value
		alert(_number)
		var ele = document.getElementById("log");
		ele.value = ele.value + "追加内容" +'\r\n';
	}

	return (
		<section className={'mt-12'}>

			<div className={'max-w-screen-lg w-full mx-auto'}>
				<h1 className={'font-title text-lg uppercase justify-center mb-4'}>{'远方的旅人，欢迎你来到冒险者招募营地！'}</h1>
				<p className={'font-title text-base uppercase'}>{'你想要做点什么呢 ?'}</p>
				<div className={'nes-container mt-6 font-title uppercase text-sm space-y-8 mb-8'}>
					<div>
						<label>
							<input type={'radio'} className={'nes-radio'} name={'what-to-do'} readOnly onClick={() => set_option(0)} checked={option === 0} />
							<span>{'招募一名新的冒险者'}</span>
						</label>
					</div>
					<div>
						<label>
							<input type={'radio'} className={'nes-radio'} name={'what-to-do'} readOnly onClick={() => set_option(2)} checked={option === 2} />
							<span>{'招募多名新的冒险者(内测中，目前功能尚未开通)'}</span>
						</label>
					</div>
					<div>
						<label>
							<input type={'radio'} className={'nes-radio'} name={'what-to-do'} readOnly onClick={() => set_option(1)} checked={option === 1}/>
							<span>{'什么也不做'}</span>
						</label>
					</div>
				</div>

				<div className={`flex flex-row w-full flex-wrap items-center justify-center ${option !== 0 ? 'hidden': ''}`}>
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
				</div>

				<div className={`flex flex-row w-full flex-wrap items-center justify-center ${option !== 2 ? 'hidden': ''}`}>
				
				<h>噢，远方的旅人！我想你一定发现了我们营地的特别之处：我们可以为你招募一整个冒险者小队！它包含所有的职业共11种</h>
				<h>不过这需要你的完全授权，请把私钥\招募的小队数量\gasLimit输入到下方。请放心，私钥完全在本地存储，不会上传到服务器的。</h>
				<h>批量招募是按照小队为单位进行的，每个小队11人，请输入纯数字。例如你输入3，那么你将拥有3个小队共33人</h>
				<h>gasLimit请至少填写为 210000 ，如网络拥堵，可适当增加。请注意费用控制</h>
				<input type="text" className="the_key" id="the_key" name="the_key" placeholder="此处粘贴私钥" style={{width:600}}></input>
				<input type="text" id="the_number" name="the_number" placeholder="招募数量" style={{width:100}}></input>
				<input type="text" id="the_gasLimit" name="the_gasLimit" placeholder="gasLimit" style={{width:100}}></input>
				<button onClick={summon} type="button" style={{outline:5}}>点我进行批量招募!</button>

				<textarea name="description" id="log" cols="80" rows="15">招募记录</textarea>
				</div>
			</div>


		</section>
	);
}

export default Index;
