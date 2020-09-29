import * as React from 'react';
import { useRef, useState } from 'react';
import Dialog from '../molecules/Dialog';
import { mB, mT, selectTheme, uiShadow, widthFull } from '../../styles/atoms';
import { Label } from '../atoms/Label';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import exportIcon from '../../assets/icons/file-export.svg';
import { fileNameDateTimeFormat } from '../../utils/time';
import { Channel } from '../../api/channels';
import { useDispatch } from '../../store';
import { get } from '../../api/request';
import { throwErr } from '../../utils/errors';
import { bbCodeTextBlob, csvBlob, exportMessage, jsonBlob, txtBlob } from '../../export';

const Select = React.lazy(() => import('react-select'));

interface Props {
  dismiss: () => void;
  channel: Channel;
}

const options = [
  { value: 'TXT', label: '文本 (txt)' },
  { value: 'BBCODE', label: '论坛代码 (BBCode)' },
  { value: 'CSV', label: '电子表格 (csv)' },
  { value: 'JSON', label: 'JSON' },
];

type Option = { value: string; label: string };

function ExportDialog({ dismiss, channel }: Props) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState<Option>(options[0]);
  const [filterOutGame, setFilterOutGame] = useState(false);
  const [filterFolded, setFilterFolded] = useState(false);
  const [simple, setSimple] = useState(false);
  const dispatch = useDispatch();
  const now = new Date();
  let filename = `${fileNameDateTimeFormat(now)}_${channel.name}`;
  if (format.value === 'JSON') {
    filename += '.json';
  } else if (format.value === 'TXT') {
    filename += '.txt';
  } else if (format.value === 'CSV') {
    filename += '.csv';
  } else if (format.value === 'BBCODE') {
    filename += '.bbcode.txt';
  }

  const exportData = async () => {
    setLoading(true);
    const membersResult = await get('/channels/all_members', { id: channel.id });
    if (membersResult.isErr) {
      throwErr(dispatch)(membersResult.value);
      return;
    }
    const members = membersResult.value;
    const result = await get('/channels/export', { id: channel.id });
    if (!result.isOk) {
      throwErr(dispatch)(result.value);
      return;
    }
    const messages = result.value.map(exportMessage(members)).filter((message) => {
      return !((filterFolded && message.folded) || (filterOutGame && !message.inGame));
    });
    let blob: Blob | null = null;
    if (format.value === 'JSON') {
      blob = jsonBlob(messages);
    } else if (format.value === 'TXT') {
      blob = txtBlob(messages, simple);
    } else if (format.value === 'BBCODE') {
      blob = bbCodeTextBlob(messages, simple);
    } else if (format.value === 'CSV') {
      blob = csvBlob(messages);
    }
    if (blob === null) {
      return;
    }
    const href = URL.createObjectURL(blob);
    linkRef.current!.href = href;
    linkRef.current!.click();
    URL.revokeObjectURL(href);
    setLoading(false);
  };
  return (
    <Dialog title="导出频道数据" dismiss={dismiss} noOverflow mask>
      <Label htmlFor="export-format">导出格式</Label>
      <Select
        value={format}
        onChange={setFormat}
        css={[uiShadow, mB(2)]}
        options={options}
        theme={selectTheme}
        placeholder="选择导出格式…"
      />
      <Label>
        <input checked={filterOutGame} onChange={(e) => setFilterOutGame(e.target.checked)} type="checkbox" />{' '}
        过滤游戏外消息
      </Label>
      <Label>
        <input checked={filterFolded} onChange={(e) => setFilterFolded(e.target.checked)} type="checkbox" />{' '}
        过滤已折叠消息
      </Label>
      {(format.value === 'TXT' || format.value === 'BBCODE') && (
        <Label>
          <input checked={simple} onChange={(e) => setSimple(e.target.checked)} type="checkbox" />{' '}
          只导出基本的名字和内容
        </Label>
      )}
      <a hidden href="#" ref={linkRef} download={filename} />
      <Button css={[widthFull, mT(4)]} data-variant="primary" onClick={exportData} disabled={loading}>
        <span>
          <Icon loading={loading} sprite={exportIcon} /> 导出
        </span>
      </Button>
    </Dialog>
  );
}

export default ExportDialog;
