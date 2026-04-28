import React from 'react';
import { Text, View, Linking } from 'react-native';
import { Document, Block, Inline, BLOCKS, INLINES } from '@contentful/rich-text-types';

type NodeRenderer = (node: any, children: React.ReactNode) => React.ReactNode;

interface RenderOptions {
  renderNode?: Record<string, NodeRenderer>;
}

const defaultRenderNode: Record<string, NodeRenderer> = {
  [BLOCKS.PARAGRAPH]: (node, children) => (
    <Text className="mb-4 font-lexendRegular text-base leading-6 text-[#333]" key={Math.random()}>
      {children}
    </Text>
  ),
  [BLOCKS.HEADING_1]: (node, children) => (
    <Text className="mb-4 mt-6 font-lexendBold text-2xl text-[#333]" key={Math.random()}>
      {children}
    </Text>
  ),
  [BLOCKS.HEADING_2]: (node, children) => (
    <Text className="mb-3 mt-5 font-lexendSemiBold text-xl text-[#333]" key={Math.random()}>
      {children}
    </Text>
  ),
  [BLOCKS.HEADING_3]: (node, children) => (
    <Text className="mb-2 mt-4 font-lexendSemiBold text-lg text-[#333]" key={Math.random()}>
      {children}
    </Text>
  ),
  [BLOCKS.HEADING_4]: (node, children) => (
    <Text className="mb-2 mt-3 font-lexendMedium text-base text-[#333]" key={Math.random()}>
      {children}
    </Text>
  ),
  [BLOCKS.UL_LIST]: (node, children) => (
    <View className="mb-4 ml-4" key={Math.random()}>
      {children}
    </View>
  ),
  [BLOCKS.OL_LIST]: (node, children) => (
    <View className="mb-4 ml-4" key={Math.random()}>
      {children}
    </View>
  ),
  [BLOCKS.LIST_ITEM]: (node, children) => (
    <View className="mb-2 flex-row" key={Math.random()}>
      <Text className="mr-2 font-lexendRegular text-[#333]">•</Text>
      <View className="flex-1">{children}</View>
    </View>
  ),
  [BLOCKS.QUOTE]: (node, children) => (
    <View className="mb-4 ml-4 border-l-4 border-[#BF5F1D] pl-4" key={Math.random()}>
      <Text className="font-lexendRegular italic text-[#666]">{children}</Text>
    </View>
  ),
  [BLOCKS.HR]: () => <View className="my-6 h-px bg-gray-300" key={Math.random()} />,
  [INLINES.HYPERLINK]: (node, children) => (
    <Text
      className="font-lexendRegular text-[#BF5F1D] underline"
      key={Math.random()}
      onPress={() => {
        const url = node.data?.uri;
        if (url) Linking.openURL(url);
      }}>
      {children}
    </Text>
  ),
};

const renderNode = (node: Block | Inline, options: RenderOptions): React.ReactNode => {
  const nodeType = node.nodeType;
  const renderer = options.renderNode?.[nodeType] || defaultRenderNode[nodeType];

  // Render children first
  const children = node.content?.map((childNode, index) => {
    if (childNode.nodeType === 'text') {
      return (childNode as any).value;
    }
    return renderNode(childNode as Block | Inline, options);
  });

  if (renderer) {
    return renderer(node, children);
  }

  // Fallback for unknown node types
  return <Text key={Math.random()}>{children}</Text>;
};

/**
 * Custom React Native rich text renderer for Contentful documents
 */
export const documentToReactNativeComponents = (
  document: Document,
  options: RenderOptions = {}
): React.ReactNode => {
  if (!document || !document.content) {
    return null;
  }

  const mergedOptions: RenderOptions = {
    renderNode: {
      ...defaultRenderNode,
      ...options.renderNode,
    },
  };

  return document.content.map((node, index) => {
    return renderNode(node, mergedOptions);
  });
};
