import { FC, useEffect, useState } from 'react';
import classNames from 'shared/lib/classNames/classNames';
import { Popup } from 'shared/ui/Popup';
import { useRootStore } from 'stores/RootStore';
import { observer } from 'mobx-react';
import { AutoCompleteInput } from 'shared/ui/AutoCompleteInput';
import { ipcInvoke } from 'shared/lib/ipcInvoke/ipcInvoke';
import { Tag } from 'bindings/';

export const AskTagPopup: FC<Props> = observer(({ className }) => {
	const { popupStore } = useRootStore();
	const [tagName, setTagName] = useState('');
	const [tags, setTags] = useState<Tag[]>([]);
	const onEnter = () => {
		const tag = tags.find(t => t.name === tagName);
		if (!tag) return;
		popupStore.resolvePopup(tag);
	};
	useEffect(() => {
		ipcInvoke<Tag[]>('get_tags').then(setTags);
	},[]);
	return (
		<Popup>
			<div onKeyDown={e => e.key === 'Enter' && onEnter()}  
				className={classNames('', {}, [className])}>
				<AutoCompleteInput 
					autocompleteOptions={tags.map(t => t.name)} 
					value={tagName} 
					onChange={(e) => setTagName(e.target.value)} placeholder='tag name' 
					setValue={value => setTagName(value.toString())}
				/>
			</div>
		</Popup>
	);
});

interface Props {
	className?: string
}
