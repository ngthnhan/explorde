module PostsHelper
	def get_user_vote_action(post)
		if current_user.liked? post
			like_button = link_to fa_stacked_icon("thumbs-up inverse", base: "square", class: "voted"), unlike_post_path(post), method: :put, remote: true
		else
			like_button = link_to fa_stacked_icon("thumbs-up", base: "square-o"), like_post_path(post), method: :put, remote: true
		end

		if current_user.disliked? post
			dislike_button = link_to fa_stacked_icon("thumbs-down inverse", base: "square", class: "voted"), undislike_post_path(post), method: :put, remote: true
		else
			dislike_button = link_to fa_stacked_icon("thumbs-down", base: "square-o"), dislike_post_path(post), method: :put, remote: true
		end

		raw "#{like_button} #{dislike_button}"
	end
end
