class CommentsController < ApplicationController
	before_action :set_post, only: [:create, :destroy, :edit]
	before_action :set_comment, only: [:edit, :destroy, :update]
	# POST /posts/:post_id/comments
	# POST /posts/:post_id/comments.json
	def create
		@comment = @post.comments.build(comment_params)
		@comment.user = current_user

		respond_to do |format|
      if @comment.save
        format.html { redirect_to @post, notice: 'Comment was successfully created.' }
        format.json { render :show, status: :created, location: @comment }
      else
        format.html { redirect_to @post }
        format.json { render json: @comment.errors, status: :unprocessable_entity }
      end
    end
	end

  # DELETE /posts/:post_id/comments/1
  # DELETE /posts/:post_id/comments/1.json
	def destroy
		@comment = @post.comments.find(params[:id])
		respond_to do |format|
			format.html { redirect_to @post, notice: 'Comment was successfully destroyed.' }
			format.json { head :no_content }
		end
	end

	private
	def set_post
		@post = Post.find(params[:post_id])
	end

	def comment_params
		params.require(:comment).permit(:content)
	end
end
