function MainContent({ content } : { content: string }) {
    // TODO: Implement tree viewing here - just encapsulate the logic,
    // including switching between visualized/plain text
    return (
        <pre className='h-[87vh] overflow-y-scroll snap-y snap-mandatory snap-end' style={{ width: '80vw' }}>
            {content}
        </pre>
    )
}

export default MainContent;